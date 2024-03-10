import React, { useState } from 'react';
import { Stage, Layer, Line, Circle, Text, Transformer } from 'react-konva';
import Tooltip from 'react-tooltip';
import SteelBar from './beam/SteelBar';
import BeamAxis from './beam/BeamAxis';


const DotVerticalLines = ({ x1, x2, x3, y }) => {
  const midX = (x2 + x3) / 2;
  const midY = y;
  // Calculate the vertical offset for the second line
  const strokeWidth = 4;
  const offset = strokeWidth + 1;

  const controlX = x1 + 10;
  const controlY = y - 20;
  return (
    <Layer>
      <BeamAxis spans={[100, 100]}></BeamAxis>

      {/* First horizontal line */}

      <Text x={x1 - 20} y={y - 5} text="Label 1" fontSize={4} />
      <Text x={midX - 20} y={midY - 5} text="Label 2" fontSize={4} />
      <Text x={x1 - 20} y={y + 15 - 5} text="Label 3" fontSize={4} />

      <Line points={[x1, y + 15, x1, y, midX, midY]} lineCap='round' lineJoin='round' stroke="blue" strokeWidth={strokeWidth} />

      <SteelBar x1={x1} x2={midX} y={midY + offset + 50} label="label" isMain={true} isAnchorBegin={true} isUp={true} anchorSize={10} isAnchorEnd={true}> </SteelBar>
      {/* Second parallel horizontal line */}
      <Line points={[midX - 15, y + offset, x3, midY + offset]} stroke="blue" strokeWidth={strokeWidth} />
      <Text x={x1 + (midX - x1) / 2 - 20} y={y + 20 - 5} text={`Label 4 (${(midX - x1).toFixed(2)})`} fontSize={4} />


      <SteelBar x1={midX - 15} x2={x3} y={midY + offset + 20} label="label"></SteelBar>
      {/* Circle around text */}
      <Circle x={x1} y={y + 115} radius={6} stroke="red" strokeWidth={1} />
      <Text x={x1 - 1} y={y + 113} text="1" fontSize={4} fill="black" align="center" verticalAlign="middle" />
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
