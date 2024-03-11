import React from 'react';
import { Circle, Line, Text } from 'react-konva';

const AXIS_MARGIN_TOP = 50;
const AXIS_MARGIN_LEFT = 50;
const YAXIS_OVER_LEFT_RIGHT = 20;
const AXIS_HEIGHT = 100;
const AXIS_LEGEND_COLOR = 'black';
const AXIS_LEGEND_CIRCLE_COLOR = 'red';
const AXIS_X_COLOR = 'red';
const AXIS_Y_COLOR = 'green';

const BeamAxis = ({ spans }) => {
    const newSpans = [AXIS_MARGIN_LEFT, ...spans];
    const verticalLines = newSpans.map((span, index) => {
        // Calculate the x-coordinate of the current vertical line
        const x = index === 0 ? span : newSpans.slice(0, index).reduce((a, b) => a + b, 0) + span;
        return { x, y: AXIS_MARGIN_TOP };
    });

    const yAxisX1 = verticalLines[0].x - YAXIS_OVER_LEFT_RIGHT;
    const yAxisX2 = verticalLines[verticalLines.length - 1].x + YAXIS_OVER_LEFT_RIGHT;


    return (
        <>
            {/* show X axis*/}
            {verticalLines.map(({ x, y }, index) => (
                <React.Fragment key={index}>
                    <Line points={[x, y, x, y + AXIS_HEIGHT]} stroke={AXIS_X_COLOR} dash={[3, 3]} />
                    <Circle x={x} y={y + AXIS_HEIGHT + 15} radius={6} stroke={AXIS_LEGEND_CIRCLE_COLOR} strokeWidth={1} />
                    <Text x={x - 1} y={y + AXIS_HEIGHT + 13} text={index + 1} fontSize={4} fill={AXIS_LEGEND_COLOR} align="center" verticalAlign="middle" />
                </React.Fragment>
            ))}
            {/* show Y axis*/}

            <Line points={[yAxisX1, AXIS_MARGIN_TOP + AXIS_HEIGHT / 2, yAxisX2 + 20, AXIS_MARGIN_TOP + AXIS_HEIGHT / 2]} stroke={AXIS_Y_COLOR} dash={[3, 3]} />
        </>
    );
};


export default BeamAxis;
