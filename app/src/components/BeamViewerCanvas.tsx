import Konva from 'konva';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import BeamAxis, { AXIS_HEIGHT, AXIS_MARGIN_LEFT, AXIS_MARGIN_TOP } from '../beam/BeamAxis';
import MainBar, { LENGTH_SCALE } from '../beam/MainBar';
import "./BeamViewerCanvas.css";

interface DrawingCanvasProps {
  topBars?: any[];
  bottomBars?: any[];
  indexes?: any[],
  onAddBar?: (lines: any) => void
};

const DotVerticalLines: React.FC<DrawingCanvasProps> = ({ topBars, bottomBars, indexes, onAddBar }) => {
  // Calculate the vertical offset for the second line
  const strokeWidth = 4;
  const offset = strokeWidth + 10;
  const y = AXIS_MARGIN_TOP;
  const MARGIN_X_AXIS = 5;
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

interface BeamViewerCanvasProps {
  topBars?: any[];
  bottomBars?: any[];
  indexes?: any[]
};

const BeamViewerCanvas = forwardRef<any, BeamViewerCanvasProps>(({ topBars, bottomBars, indexes }, ref) => {
  const [scale, setScale] = useState(2);
  const handleScaleIn = () => {
    setScale(scale * 1.1);
  };

  const handleScaleOut = () => {
    setScale(scale / 1.1);
  };

  const handleZoomTo = (action: string, span: any, sum: any) => {
    handleNewSpan(sum);
  };

  // Forwarding the ref to the component
  useImperativeHandle(ref, () => ({
    handleZoomTo: handleZoomTo
  }));

  const stageRef = useRef<any>();
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState(0);


  const handleNewSpan = (sum: any) => {
    const x = parseInt(sum) * LENGTH_SCALE + AXIS_MARGIN_LEFT;
    const newStartX = x;
    const newTargetScale = 2; // Example scale (zoom level)
    const newEndX = x * newTargetScale;

    const newTargetX = newEndX; // Example X-coordinate

    // Smoothly animate the transition to the new target
    //console.log('newTargetX * newTargetScale + window.innerWidth / 2',newTargetX * newTargetScale + window.innerWidth / 2)
    const anim = new Konva.Tween({
      node: stageRef.current,
      duration: 0.5,
      easing: Konva.Easings.StrongEaseInOut,
      //scaleX: newTargetScale,
      //scaleY: newTargetScale,
      x: - newTargetX + AXIS_MARGIN_LEFT * 2
    });
    anim.play();
  }
  const handleAddBar = (lines: any) => {
  }

  useEffect(() => {
    if (stageContainerRef.current && stageContainerRef.current.parentElement) {
      const parentHeight = stageContainerRef.current.parentElement.clientHeight + 100;
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

export default BeamViewerCanvas;
