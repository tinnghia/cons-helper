import { useState } from 'react';
import { Layer, Stage } from 'react-konva';
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
  const [scale, setScale] = useState(1);

  const handleScaleIn = () => {
    setScale(scale * 1.1);
  };

  const handleScaleOut = () => {
    setScale(scale / 1.1);
  };
  return (
    <div>
      <button onClick={handleScaleIn}>Scale In</button>
      <button onClick={handleScaleOut}>Scale Out</button>
      <Stage width={window.innerWidth} height={window.innerHeight} scaleX={scale} scaleY={scale}>
        {/* Dot Vertical Lines */}
        <DotVerticalLines x1={50} x2={150} x3={250} y={50} />
      </Stage>
    </div>
  );
};

export default DrawBeam;
