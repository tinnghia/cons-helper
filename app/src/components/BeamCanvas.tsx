import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import BeamAxis, { AXIS_HEIGHT, AXIS_MARGIN_TOP } from '../beam/BeamAxis';
import MainBar from '../beam/MainBar';
import "./BeamCanvas.css";

interface BeamCanvasProps {
  topBars?: any[];
  bottomBars?: any[];
  indexes?: any[],
  onAddBar: (lines: any) => void
};

const DotVerticalLines: React.FC<BeamCanvasProps> = ({ topBars, bottomBars, indexes, onAddBar }) => {
  // Calculate the vertical offset for the second line
  const strokeWidth = 4;
  const offset = strokeWidth + 10;
  const y = AXIS_MARGIN_TOP;
  const MARGIN_X_AXIS = 5;
  const mainBarRefs = useRef<{ [key: string]: React.RefObject<any> }>({});

  useEffect(() => {
    if (topBars) {
      topBars.forEach((bar, index) => {
        mainBarRefs.current[bar.label] = mainBarRefs.current[bar.label] || React.createRef();
      });
    }

    if (bottomBars) {
      bottomBars.forEach((bar, index) => {
        mainBarRefs.current[bar.label] = mainBarRefs.current[bar.label] || React.createRef();
      });
    }
  }, [topBars, bottomBars]);

  return (
    <Layer>
      <BeamAxis indexes={indexes}></BeamAxis>
      {topBars && topBars.map((bar, index) => (
        <MainBar key={index} y={y + index * offset} isUp={true} bars={bar.bars} label={index + 1} onAddBar={onAddBar}></MainBar>
      ))}

      {bottomBars && bottomBars.map((bar, index) => (
        <MainBar key={index} y={y + index * offset + MARGIN_X_AXIS + AXIS_HEIGHT / 2} isUp={false} bars={bar.bars} label={index + 1} onAddBar={onAddBar}></MainBar>
      ))}
    </Layer>
  );
};

interface BeamCanvasDefineProps {
  topBars?: any[];
  bottomBars?: any[];
  indexes?: any[]
};

const BeamCanvas = forwardRef<any, BeamCanvasDefineProps>(({ topBars, bottomBars, indexes }, ref) => {
  const [scale, setScale] = useState(2);
  const [lines, setLines] = useState<any[]>([])
  const handleScaleIn = () => {
    setScale(scale * 1.1);
  };

  const handleScaleOut = () => {
    setScale(scale / 1.1);
  };

  const handleZoomTo = (action: string, span: any) => {
  };

  // Forwarding the ref to the component
  useImperativeHandle(ref, () => ({
    handleZoomTo: handleZoomTo,
    handleMoveTo: handleMoveTo
  }));

  const handleMoveTo = (spanIndex: string) => {
    console.log('handleMoveTo', spanIndex);
    const ls = lines.filter(line => line.label === spanIndex);
    console.log('ressss', ls)

    const stage = stageRef.current;
    const stageElement = stageRef.current.container();
    const stageRect = stageElement.getClientRects()[0];

    console.log('stageRect.height ==', stageRect.height, AXIS_MARGIN_TOP + ls[0].begin.y)
    if (stageRect.height < AXIS_MARGIN_TOP + ls[0].begin.y) {
      const delta = AXIS_MARGIN_TOP + ls[0].begin.y - stageRect.height + 5;

      // Get the current position of the Stage
      const stagePosition = stage.position();
      console.log('stagePosition1', stagePosition, stageRect, ls)

      // Update the position of the Stage to center the line
      stage.position({
        x: stagePosition.x,
        y: stagePosition.y - delta,
      });

      // Request a redraw of the Stage
      stage.batchDraw();
    }


  }

  const stageRef = useRef<any>();
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState(0);

  const handleAddBar = (newLines: []) => {
    setLines(prevLines => [...prevLines, ...newLines]);
  }

  useEffect(() => {
    if (stageContainerRef.current && stageContainerRef.current.parentElement) {
      const parentHeight = stageContainerRef.current.parentElement.clientHeight - 30;
      setMinHeight(Math.max(parentHeight, 200)); // Adjust 200 as needed
    }
  }, []);

  return (
    <div style={{ height: '100%' }} ref={stageContainerRef}>
      <div className='controlBtnCls'>
        <button onClick={handleScaleIn} className='zoom' title='Zoom In'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-zoom-in" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" />
            <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
            <path fillRule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5" />
          </svg>
        </button>
        <button onClick={handleScaleOut} className='zoom' title='Zoom Out'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-zoom-out" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" />
            <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
            <path fillRule="evenodd" d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5" />
          </svg>
        </button>
      </div>
      <Stage draggable height={minHeight} width={window.innerWidth} scaleX={scale} scaleY={scale} ref={stageRef}>
        {/* Dot Vertical Lines */}
        <DotVerticalLines topBars={topBars} bottomBars={bottomBars} indexes={indexes} onAddBar={handleAddBar} />
      </Stage>
    </div>
  );
});

export default BeamCanvas;
