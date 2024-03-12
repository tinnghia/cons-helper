import { useState } from 'react';
import { Layer, Stage } from 'react-konva';
import "./DrawBeam.css";
import BeamAxis from './beam/BeamAxis';
import MainBar from './beam/MainBar';
import SteelBar from './beam/SteelBar';

const DotVerticalLines = ({ x1, x2, x3, y }) => {
  const midX = (x2 + x3) / 2;
  const midY = y;
  // Calculate the vertical offset for the second line
  const strokeWidth = 4;
  const offset = strokeWidth + 1;
  return (
    <Layer>
      <BeamAxis spans={[100, 100]}></BeamAxis>
      <MainBar beginX={x1} endX={x3} y={y} isUp={true} joins={[x1 + 40, midX]} label="m1"></MainBar>

      <SteelBar x1={x1} x2={midX} y={midY + offset + 50} label="label" isMain={true} isAnchorBegin={true} isUp={true} anchorSize={10} isAnchorEnd={true}> </SteelBar>
      <SteelBar x1={midX - 15} x2={x3} y={midY + offset + 20} label="label"></SteelBar>
    </Layer>
  );
};

const DrawBeam = () => {
  const [scale, setScale] = useState(2);

  const handleScaleIn = () => {
    setScale(scale * 1.1);
  };

  const handleScaleOut = () => {
    setScale(scale / 1.1);
  };
  return (
    <div>
      <div>
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
      <Stage width={window.innerWidth} height={window.innerHeight} scaleX={scale} scaleY={scale}>
        {/* Dot Vertical Lines */}
        <DotVerticalLines x1={50} x2={150} x3={250} y={50} />
      </Stage>
    </div>
  );
};

export default DrawBeam;
