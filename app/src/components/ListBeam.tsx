import React, { useEffect, useRef, useState } from 'react';
import './ListBeam.css';
import { FaPlus, FaPlay, FaEllipsisH, FaTrash, FaPencilAlt } from 'react-icons/fa';

interface BeamNode {
    id: number;
    name: string;
    children?: BeamNode[];
}

// Sample data for the tree view
const initialBeamData = [
    {
        id: 1,
        name: 'Beam A'
    },
    {
        id: 2,
        name: 'Beam B'
    }
];

// TreeItem component to represent each beam or sub beam
const TreeItem: React.FC<{ item: BeamNode; isSelected: boolean; onSelect: () => void }> = ({ item, isSelected, onSelect }) => {
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
    };

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

    return (
        <a href="#" className={`beam-item ${isSelected ? 'selected' : ''}`} onClick={handleClick} onContextMenu={handleContextMenu}
            onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className='beam-item-content'>
                <span>{item.name}</span>
                {(isHovered || isSelected) && (
                    <div className="menu">
                        <FaEllipsisH className="icon" onClick={handleContextMenuClick}/>

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
};

// Tree component to render the tree view
const Tree: React.FC<{ beamData: BeamNode[] }> = ({ beamData }) => {
    const [selectedItem, setSelectedItem] = useState<BeamNode | null>(null);

    const handleSelectItem = (item: BeamNode) => {
        setSelectedItem(item);
    };

    return (
        <div className='list-beam'>
            {beamData.map(beam => (
                <TreeItem key={beam.id} item={beam} isSelected={selectedItem === beam} onSelect={() => handleSelectItem(beam)} />
            ))}
        </div>
    );
};

const ListBeam: React.FC<{ show: boolean }> = ({ show }) => {
    const [beamData, setBeamData] = useState(initialBeamData);

    const handleAddChild = () => {
        const newId = Math.max(...beamData.map(beam => beam.id)) + 1;
        const newBeam = {
            id: newId,
            name: `New Beam ${newId}`,
            children: []
        };
        setBeamData(prevData => [...prevData, newBeam]);
    };

    return (
        <div className={show ? "tree-column" : "tree-column hide"}>
            <div className="button-group">

                <button className="add-child-btn" onClick={handleAddChild}>New Beam<FaPlus className="icon" /></button>
                <button className="run-all-btn" onClick={handleAddChild}>Run<FaPlay className="icon" /></button>
            </div>
            <Tree beamData={beamData} />
        </div>
    );
};

export default ListBeam;
