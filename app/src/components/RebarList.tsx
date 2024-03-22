import { FunctionComponent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import './RebarList.css';

interface AccordionProps {
  title: string;
  columnIndex: string;
  barItems: any[];
  initExpanded: boolean;
}

const Accordion = forwardRef<any, AccordionProps>(({ title, columnIndex, barItems, initExpanded }, ref) => {
  const [expanded, setExpanded] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const onEditColumnIndex = (idx: string) => {

  };

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  useImperativeHandle(ref, () => ({
    onEditColumnIndex: onEditColumnIndex
  }));

  useEffect(() => {
    setExpanded(initExpanded);

  }, [initExpanded]);


  let accordionStyle = {};
  if (expanded && contentRef.current) {
    accordionStyle = { height: contentRef.current?.scrollHeight + 'px' };
  }

  return (
    <div className="accordion" style={accordionStyle}>
      <div className="accordion-header" onClick={toggleAccordion}>
        <div>{title}</div>
        <div className={`accordion-icon ${expanded ? 'expanded' : ''}`}>&#x25B6;</div>
      </div>
      {expanded && (
        <div className="accordion-content" ref={contentRef}>
          {barItems.map((barItem, index) => (
            <div key={index} className="barItem">
              <div className="rebarTextItem">
                <span className="rebarLengthCls">{barItem.length}</span>
                <span>x</span>
                <span className="rebarNumberCls">{barItem.number}</span>
                <span className="rebarPositionCls">{barItem.position}</span>
                <span className="rebarTypeCls">{barItem.type}</span>
              </div>
              <button type="button" className="barItemBtn">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

});


const RebarList: FunctionComponent<{ barItems: any[], expandedColumnIndex: string }> = ({ barItems, expandedColumnIndex }) => {
  const [expandedIndex, setExpandedIndex] = useState<string>('');
  const[uniqueColumnIndexes,setUniqueColumnIndexes] = useState<string[]>([]);
  // Filter barItems based on columnIndex
  const filteredBarItemsByColumnIndex = (columnIndex: string) => {
    return barItems.filter((item) => item.columnIndex === columnIndex);
  };

  useEffect(() => {
    setExpandedIndex(expandedColumnIndex);
    setUniqueColumnIndexes(Array.from(new Set(barItems.map((item) => item.columnIndex))))

  }, [expandedColumnIndex,barItems]);

  return (
    <div className="rebar-list">
      {uniqueColumnIndexes.map((columnIndex) => (
        <Accordion
          key={columnIndex}
          columnIndex={columnIndex}
          title={`Column ${ parseInt(columnIndex) + 1}`}
          initExpanded={expandedIndex === columnIndex}
          barItems={filteredBarItemsByColumnIndex(columnIndex)}
        />
      ))}
    </div>
  );
};

export default RebarList;
