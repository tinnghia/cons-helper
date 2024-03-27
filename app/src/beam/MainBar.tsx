import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import SteelBar, { DEFAULT_BAR_MAIN_THICKNESS } from './SteelBar';
import { AXIS_MARGIN_LEFT } from './BeamAxis';


const DEFAULT_ANCHOR_SIZE = 10;
export const LENGTH_SCALE = 0.01;

interface MainBarProps {
    y: number,
    bars: any[],
    isUp: boolean,
    label: any,
    onAddBar?: (lines: any) => void;
}
const MainBar = forwardRef<any, MainBarProps>(({ y, bars, isUp, label, onAddBar }, ref) => {
    //const _anchorSize = anchorSize ? anchorSize : DEFAULT_ANCHOR_SIZE;
    //const length = bars.length;
    const horizontalLines = bars.map((bar, index) => {
        // Calculate the x-coordinate of the current horizontal lines
        const bx = bar.beginValue * LENGTH_SCALE + AXIS_MARGIN_LEFT;
        const by = (index === 0) ? y : y + DEFAULT_BAR_MAIN_THICKNESS * (index % 2);
        const ex = bar.endValue * LENGTH_SCALE + AXIS_MARGIN_LEFT;
        const ey = by;
        return {
            begin: {
                x: bx,
                y: by
            },
            end: {
                x: ex,
                y: ey
            },
            label: bar.refBar ? `L${bar.refBar.index}_${bar.refBar.subIndex}` : '',
            beginAnchor: bar.beginAnchor * LENGTH_SCALE,
            endAnchor: bar.endAnchor * LENGTH_SCALE
        };
    });

    useEffect(() => {
        if (onAddBar)
            onAddBar(horizontalLines);
    }, []);

    useImperativeHandle(ref, () => ({
    }));

    return (
        <>
            {horizontalLines.map(({ begin, end, beginAnchor, endAnchor, label }, index) => (

                <React.Fragment key={index}>
                    <>
                        <SteelBar x1={begin.x} x2={end.x} y={begin.y} label={label} isMain={true}
                            isAnchorBegin={true} isUp={isUp} anchorSize={0} isAnchorEnd={false} beginAnchor={beginAnchor} endAnchor={endAnchor} />
                    </>
                </React.Fragment>
            ))}
        </>
    );
});


export default MainBar;
