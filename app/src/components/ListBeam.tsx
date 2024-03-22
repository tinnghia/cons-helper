import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import './ListBeam.css';
import { FaPlus, FaPlay, FaEllipsisH, FaTrash, FaPencilAlt } from 'react-icons/fa';
import { BeamDataProps } from './DesignBeamInputForm';

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
    onLabelChange: (id: number, value: string) => void;
}

// TreeItem component to represent each beam or sub beam
const TreeItem = forwardRef<any, TreeItemProps>(({ item, id, isSelected, onSelect, onLabelChange }, ref) => {

    const spanRef = useRef<HTMLSpanElement>(null);
    const [itemName, setItemName] = useState(item.name);
    const [editable, setEditable] = useState(false);

    const handleDoubleClick = () => {
        setEditable(true);

        const spanElement = spanRef.current;
        console.log('handleDoubleClick', spanElement)
        if (!spanElement) return; // Guard clause to handle null ref

        const range = document.createRange();
        range.selectNodeContents(spanElement);

        const selection = window.getSelection();
        if (!selection) return; // Guard clause to handle null selection

        selection.removeAllRanges();
        selection.addRange(range);
        // Use type assertion to assert the type of spanElement
        const childNodes = (spanElement as HTMLElement).childNodes;
        console.log('childNodes', childNodes)
        if (childNodes && childNodes.length > 0) {
            const textNode = childNodes[0] as Text;
            console.log('textNode', textNode)
            const rangeEnd = document.createRange();
            rangeEnd.setStart(textNode, textNode.length);
            rangeEnd.collapse(true);

            selection.removeAllRanges();
            selection.addRange(rangeEnd);
        }
    };

    const handleBlur = () => {
        console.log('handleBlur')
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

    const handleClick = () => {
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
}
// Tree component to render the tree view
const Tree = forwardRef<any, TreeProps>(({ beamData, onLabelChange }, ref) => {
    const [selectedItem, setSelectedItem] = useState<BeamNode | null>(null);
    const newBeamRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    const handleSelectItem = (item: BeamNode) => {
        setSelectedItem(item);
    };

    const prevBeamDataRef = useRef(beamData);

    const focusOnNewBeam = (newId: number) => {
        const newItemRef = newBeamRefs.current[newId];
        console.log('focusOnNewBeam', newItemRef)
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

    useEffect(() => {
        if (beamData.length > prevBeamDataRef.current.length) { // Assuming new item added
            const newBeam = beamData.find(beam => !prevBeamDataRef.current.some(prevBeam => prevBeam.id === beam.id));
            const newBeamId = newBeam ? newBeam.id : null;
            console.log('newBeamIdnewBeamIdnewBeamId', newBeamId)
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
                    onLabelChange={handleLabelChange}
                    ref={ref => {
                        if (ref && !newBeamRefs.current[beam.id]) {
                            console.log('adding new', beam.id)
                            newBeamRefs.current[beam.id] = ref;
                        }
                    }} />
            ))}
        </div>
    );
});

const ListBeam: React.FC<{ show: boolean, initBeamData: BeamNode[], onBeamDataUpdate: (updatedBeamData: BeamNode[]) => void }> = ({ show, initBeamData, onBeamDataUpdate }) => {
    const [beamData, setBeamData] = useState<BeamNode[]>(initBeamData);
    const treeRef = useRef<any>(null);

    const handleAddChild = () => {
        const newId = beamData.length > 0 ? Math.max(...beamData.map(beam => beam.id)) + 1 : 1;
        const newBeam = newDefaultBeam(newId);
        const updatedBeamData:BeamNode[] = [...beamData, newBeam]
        /*setBeamData((prevData: BeamNode[]) => {
            return [...prevData, newBeam]
        });*/
        setBeamData(updatedBeamData);
        onBeamDataUpdate(updatedBeamData);
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
            unit: '',
            standardBarLength: 0,
            mainBarDiameter: 0,
            rifBarDiameter: 0,
            labLength: 0,
            anchorLength: 0,
            topMainBars: 0,
            bottomMainBars: 0,
            topSafeZoneAwayFromColumn: 0,
            bottomSafeZoneFromColumn: 0,
            firstColumnIndex: 0,
            lastColumnIndex: 0,
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

    return (
        <div className={show ? "tree-column" : "tree-column hide"}>
            <div className="button-group">

                <button className="add-child-btn" onClick={handleAddChild}>New Beam<FaPlus className="icon" /></button>
                <button className="run-all-btn" onClick={handleAddChild}>Run<FaPlay className="icon" /></button>
            </div>
            <Tree beamData={beamData} ref={treeRef} onLabelChange={handleLabelChange} />
        </div>
    );
};

export default ListBeam;
