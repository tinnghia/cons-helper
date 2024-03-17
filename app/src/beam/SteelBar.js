import { useState } from 'react';
import { Line, Text } from 'react-konva';
import { LENGTH_SCALE } from './MainBar';

export const DEFAULT_BAR_MAIN_THICKNESS = 4;
export const DEFAULT_BAR_SECONDARY_THICKNESS = 4;
const DEFAULT_SPACE_BETWEEN_LABEL_BAR = 2;
const DEFAULT_LABEL_FONT_SIZE = 5;
const DEFAULT_LABEL_MAIN_COLOR = 'blue';
const DEFAULT_LABEL_SECONDARY_COLOR = 'blue';
const DEFAULT_BAR_MAIN_COLOR = 'blue';
const DEFAULT_BAR_SECONDARY_COLOR = 'orange';
const DEFAULT_BLUR_COLOR = 'grey';

const SteelBar = ({ x1, x2, y, label, isMain, isUp, anchorSize, isAnchorBegin, isAnchorEnd, beginAnchor, endAnchor, unit = 'm' }) => {
  const [isClicked, setIsClicked] = useState(false);

  // Calculate label position
  const labelX = (x1 + x2) / 2 - 10;
  const labelY = y - DEFAULT_BAR_MAIN_THICKNESS - DEFAULT_SPACE_BETWEEN_LABEL_BAR;

  const handleMouseEnter = (e) => {
    setIsClicked(true);
    e.target.getStage().container().style.cursor = 'pointer';
  };

  const handleMouseLeave = (e) => {
    setIsClicked(false);
    e.target.getStage().container().style.cursor = 'default';
  };

  const barThickness = isMain ? DEFAULT_BAR_MAIN_THICKNESS : DEFAULT_BAR_SECONDARY_THICKNESS;
  let points = [];
  if (isMain && beginAnchor && beginAnchor > 0) {
    points.push(x1);
    points.push(isUp ? y + beginAnchor : y - beginAnchor);
  }

  points.push(x1);
  points.push(y);
  points.push(x2);
  points.push(y);

  if (isMain && endAnchor && endAnchor > 0) {
    points.push(x2);
    points.push(isUp ? y + endAnchor : y - endAnchor);
  }
  return (
    <>
      {/* Line */}
      <Line
        points={points}
        stroke={isClicked ? DEFAULT_BLUR_COLOR : isMain ? DEFAULT_BAR_MAIN_COLOR : DEFAULT_BAR_SECONDARY_COLOR}
        strokeWidth={isClicked ? barThickness : barThickness - 1}
        opacity={isClicked ? 0.5 : 1}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleMouseEnter}
        onTap={handleMouseEnter}

        shadowColor={isClicked ? DEFAULT_BLUR_COLOR : isMain ? DEFAULT_BAR_MAIN_COLOR : DEFAULT_BAR_SECONDARY_COLOR}
        shadowBlur={isClicked ? 10 : 0}
        shadowOffsetX={isClicked ? 5 : 0}
        shadowOffsetY={isClicked ? 5 : 0}
        lineCap="round"
        lineJoin='round'
        cursor={isClicked ? 'pointer' : 'default'}

      />
      {/* Label */}
      <Text x={labelX} y={labelY} text={`${label} (${((x2 - x1) / LENGTH_SCALE).toFixed(2)}${unit})`} fontSize={DEFAULT_LABEL_FONT_SIZE} align="center"
        fill={isMain ? DEFAULT_LABEL_MAIN_COLOR : DEFAULT_LABEL_SECONDARY_COLOR}
        shadowColor={isClicked ? DEFAULT_BLUR_COLOR : isMain ? DEFAULT_BAR_MAIN_COLOR : DEFAULT_BAR_SECONDARY_COLOR}
        shadowBlur={isClicked ? 10 : 0}
        shadowOffsetX={isClicked ? 5 : 0}
        shadowOffsetY={isClicked ? 5 : 0}
        opacity={isClicked ? 0.5 : 1} />
    </>
  );
};

export default SteelBar;
