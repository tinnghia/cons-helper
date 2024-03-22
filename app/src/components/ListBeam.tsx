import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FaEllipsisH, FaPencilAlt, FaPlay, FaPlus, FaTrash } from 'react-icons/fa';
import appConfig from '../config/config.json';
import { BeamDataProps } from './DesignBeamInputForm';
import './ListBeam.css';

export interface BeamNode {
    id: number;
    name: string;
    beam: BeamDataProps;
}

interface TreeItemProps {
    id: number;
    item: BeamNode;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: (id: number) => void;
    onLabelChange: (id: number, value: string) => void;
}

// TreeItem component to represent each beam or sub beam
const TreeItem = forwardRef<any, TreeItemProps>(({ item, id, isSelected, onSelect, onLabelChange, onDelete }, ref) => {

    const spanRef = useRef<HTMLSpanElement>(null);
    const [itemName, setItemName] = useState(item.name);
    const [editable, setEditable] = useState(false);

    const handleDoubleClick = () => {
        setEditable(true);

        const spanElement = spanRef.current;
        if (!spanElement) return; // Guard clause to handle null ref

        const range = document.createRange();
        range.selectNodeContents(spanElement);

        const selection = window.getSelection();
        if (!selection) return; // Guard clause to handle null selection

        selection.removeAllRanges();
        selection.addRange(range);
        // Use type assertion to assert the type of spanElement
        const childNodes = (spanElement as HTMLElement).childNodes;
        if (childNodes && childNodes.length > 0) {
            const textNode = childNodes[0] as Text;
            const rangeEnd = document.createRange();
            rangeEnd.setStart(textNode, textNode.length);
            rangeEnd.collapse(true);

            selection.removeAllRanges();
            selection.addRange(rangeEnd);
        }
    };

    const handleBlur = () => {
        setEditable(false);
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            setEditable(false);
            onLabelChange(id, itemName);
        }
    };



    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [menuPosition, setMenuPosition] = useState<{ x?: number; y?: number } | null>(null);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleContextMenuClick = (event: React.MouseEvent<SVGAElement>) => {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        setMenuPosition({ x: buttonRect.left, y: buttonRect.bottom });
        setIsContextMenuOpen(!isContextMenuOpen);
    };

    const handleClick = (e: any) => {
        onSelect();
        setIsOpen(!isOpen);
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        onSelect();
    };

    const handleMenuClick = (action: string) => {
        // Handle menu item click based on action (e.g., rename, download, delete)
        if (action === 'rename') {
            handleDoubleClick();
        } else if (action === 'delete') {
            onDelete(id);
        }
        setIsContextMenuOpen(false);
    };

    const focus = () => {
        handleMenuClick('rename');
    }

    useImperativeHandle(ref, () => ({
        focus: focus
    }));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !(event.target as HTMLElement)?.classList.contains('icon') // Check if the target is not a descendant of FaEllipsisH
            ) {
                setIsContextMenuOpen(false);
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleChange = (event: any) => {
        setItemName(event.target.value);
    };

    return (
        <a href="#" className={`beam-item ${isSelected ? 'selected' : ''}`} onClick={handleClick} onContextMenu={handleContextMenu}
            onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className='beam-item-content'>
                {editable ? (
                    <input
                        type="text"
                        value={itemName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoFocus
                        onKeyDown={handleKeyDown}
                        style={{ width: '90px' }} // Adjust the width as needed
                    />
                ) : (
                    <span ref={spanRef} onDoubleClick={handleDoubleClick}>{itemName}</span>
                )}

                {(isHovered || isSelected) && (
                    <div className="menu">
                        <FaEllipsisH className="icon" onClick={handleContextMenuClick} />

                        <div className={`context-menu ${isContextMenuOpen ? 'show' : ''}`} style={{ left: menuPosition?.x, top: menuPosition?.y }} ref={menuRef}>
                            <div className="menu-item" onClick={() => handleMenuClick('rename')}>
                                <FaPencilAlt className="menu-icon" />Rename Beam
                            </div>
                            <div className="menu-item" onClick={() => handleMenuClick('delete')}>
                                <FaTrash className="menu-icon" />Delete Beam</div>
                        </div>
                    </div>
                )}
            </div>
        </a>
    );
});

interface TreeProps {
    beamData: BeamNode[];
    onLabelChange: (id: number, value: string) => void;
    onSelectedItemChange: (node: BeamNode) => void;
    onDelete: (id: number) => void;
}
// Tree component to render the tree view
const Tree = forwardRef<any, TreeProps>(({ beamData, onLabelChange, onSelectedItemChange, onDelete }, ref) => {
    const [selectedItem, setSelectedItem] = useState<BeamNode | null>(null);
    const newBeamRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    const handleSelectItem = (item: BeamNode) => {
        setSelectedItem(item);
        onSelectedItemChange(item);
    };

    const prevBeamDataRef = useRef(beamData);

    const focusOnNewBeam = (newId: number) => {
        const newItemRef = newBeamRefs.current[newId];
        if (newItemRef) {
            newItemRef.focus();
        }
    };

    // Expose the focusOnNewBeam function via ref
    useImperativeHandle(ref, () => ({
        focusOnNewBeam
    }));

    const handleLabelChange = (id: number, value: string) => {
        onLabelChange(id, value);
    }
    const handleDelete = (id: number) => {
        onDelete(id);
    }

    useEffect(() => {
        if (beamData.length > prevBeamDataRef.current.length) { // Assuming new item added
            const newBeam = beamData.find(beam => !prevBeamDataRef.current.some(prevBeam => prevBeam.id === beam.id));
            const newBeamId = newBeam ? newBeam.id : null;
            if (newBeamId) {
                focusOnNewBeam(newBeamId);
            }
        }
        // Update prevBeamDataRef with the current beamData
        prevBeamDataRef.current = beamData;
    }, [beamData]); // Adjust dependencies as needed

    return (
        <div className='list-beam'>
            {beamData.map(beam => (
                <TreeItem key={beam.id} id={beam.id} item={beam} isSelected={selectedItem === beam} onSelect={() => handleSelectItem(beam)}
                    onLabelChange={handleLabelChange} onDelete={handleDelete}
                    ref={ref => {
                        if (ref && !newBeamRefs.current[beam.id]) {
                            newBeamRefs.current[beam.id] = ref;
                        }
                    }} />
            ))}
        </div>
    );
});

interface ListBeamProps {
    show: boolean, initBeamData: BeamNode[],
    onBeamDataUpdate: (updatedBeamData: BeamNode[]) => void,
    onSelectedChange: (node: BeamNode | undefined) => void,
    onRun: () => void;
}
const ListBeam = forwardRef<any, ListBeamProps>(({ show, initBeamData, onBeamDataUpdate, onSelectedChange, onRun }, ref) => {
    const [beamData, setBeamData] = useState<BeamNode[]>(initBeamData);
    const treeRef = useRef<any>(null);

    const handleRun = async () => {
        const postData = beamData.map(beam => buildPostData(beam))
        console.log('postData', postData);
        onRun();
        // POST data to the endpoint

        await fetch(`${appConfig.backendUrl}/api/calculators/design`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('result', data);
                //onResult(data);
                //setIsProcessing(false);
                console.log('Data posted successfully');
            })
            .catch(error => {
                //setIsProcessing(false);
                console.error('There was a problem with your fetch operation:', error);
            });
    }

    const handleUpdateBeam = (id: number, beam: BeamDataProps) => {
    }
    useImperativeHandle(ref, () => ({
        handleUpdateBeam: handleUpdateBeam
    }));

    const buildPostData = (node: BeamNode) => {
        const postData: any = {};
        postData['id'] = node.id;
        postData['name'] = node.name;
        postData['unit'] = node.beam.unit;
        postData['standardBarLength'] = parseInt(node.beam.standardBarLength ?? '0');
        postData['mainBarDiameter'] = parseInt(node.beam.mainBarDiameter ?? '0');
        postData['rifBarDiameter'] = parseInt(node.beam.rifBarDiameter ?? '0');
        postData['labLength'] = parseInt(node.beam.labLength ?? '0');
        postData['anchorLength'] = parseInt(node.beam.anchorLength ?? '0');
        postData['topMainBars'] = parseInt(node.beam.topMainBars ?? '0');
        postData['bottomMainBars'] = parseInt(node.beam.bottomMainBars ?? '0');
        postData['topSafeZoneAwayFromColumn'] = parseFloat(node.beam.topSafeZoneAwayFromColumn ?? '0');
        postData['bottomSafeZoneFromColumn'] = parseFloat(node.beam.bottomSafeZoneFromColumn ?? '0');
        postData['firstColumnIndex'] = node.beam.firstColumnIndex === 'first+1' ? 1 : 0;
        postData['lastColumnIndex'] = node.beam.lastColumnIndex === 'last-1' ? node.beam.spans.length - 2 : node.beam.spans.length - 1;

        const lspans = node.beam.rebars.map(item => ({
            ...item,
            length: parseInt(item.length)
        }));
        const newRebars = node.beam.rebars.map(item => ({
            ...item,
            length: parseInt(item.length),
            columnIndex: parseInt(item.columnIndex),
            dia: parseInt(item.dia),
            number: parseInt(item.number),

        }));
        postData['spans'] = lspans;
        postData['rebars'] = newRebars;
        return postData;
    }
    const handleAddChild = () => {
        const newId = beamData.length > 0 ? Math.max(...beamData.map(beam => beam.id)) + 1 : 1;
        const newBeam = newDefaultBeam(newId);
        const updatedBeamData: BeamNode[] = [...beamData, newBeam]
        /*setBeamData((prevData: BeamNode[]) => {
            return [...prevData, newBeam]
        });*/
        setBeamData(updatedBeamData);
        onBeamDataUpdate(updatedBeamData);
        onHandleSelectedChange(newBeam);
        if (treeRef && treeRef.current)
            treeRef.current.focusOnNewBeam(newId);
    };

    const handleLabelChange = (id: number, value: string) => {
        setBeamData(prevData => {
            return prevData.map(item => {
                // Check if the current item has the desired id
                if (item.id === id) {
                    // If yes, update its value
                    return { ...item, value: value };
                }
                // If not, return the item unchanged
                return item;
            });
        });
    }

    const newDefaultBeam = (newId: number): BeamNode => {
        // Create default values for BeamDataProps
        const defaultBeamData: BeamDataProps = {
            unit: 'mm',
            standardBarLength: '11700',
            mainBarDiameter: '22',
            rifBarDiameter: '18',
            labLength: '30',
            anchorLength: '15',
            topMainBars: '0',
            bottomMainBars: '0',
            topSafeZoneAwayFromColumn: '0.25',
            bottomSafeZoneFromColumn: '0.25',
            firstColumnIndex: '0',
            lastColumnIndex: '0',
            spans: [],
            rebars: [] // Initialize as empty array
        };

        // Create a default BeamNode object
        const defaultBeam: BeamNode = {
            id: newId,
            name: `New Beam ${newId}`,
            beam: defaultBeamData
        };

        return defaultBeam;

    }

    const onHandleSelectedChange = (node: BeamNode) => {
        onSelectedChange(node);
    }

    const handleDelete = (id: number) => {
        setBeamData(prevBeamData => prevBeamData.filter(item => item.id !== id));
        onSelectedChange(undefined);
    }
    return (
        <div className={show ? "tree-column" : "tree-column hide"}>
            <div className="button-group">

                <button className="add-child-btn" onClick={handleAddChild}>New Beam<FaPlus className="icon" /></button>
                <button className="run-all-btn" onClick={handleRun}>Run<FaPlay className="icon" /></button>
            </div>
            <Tree beamData={beamData} ref={treeRef} onLabelChange={handleLabelChange} onSelectedItemChange={onHandleSelectedChange} onDelete={handleDelete} />
        </div>
    );
});

export default ListBeam;
