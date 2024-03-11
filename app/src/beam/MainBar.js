import React from 'react';
import SteelBar, { DEFAULT_BAR_MAIN_THICKNESS } from './SteelBar';


const DEFAULT_ANCHOR_SIZE = 10;
const JOIN_LENGTH = 15;

const MainBar = ({ beginX, endX, y, joins, isUp, anchorSize, label }) => {
    const newJoins = [beginX, ...joins];
    const length = newJoins.length;
    const _anchorSize = anchorSize ? anchorSize : DEFAULT_ANCHOR_SIZE;

    const horizontalLines = newJoins.map((x, index) => {
        // Calculate the x-coordinate of the current horizontal lines
        const bx = (index === 0) ? x : x - JOIN_LENGTH;
        const by = (index === 0) ? y : y + DEFAULT_BAR_MAIN_THICKNESS * (index % 2);
        const ex = (index < length - 1) ? newJoins[index + 1] : endX;
        const ey = by;
        return {
            begin: {
                x: bx,
                y: by
            },
            end: {
                x: ex,
                y: ey
            }
        };
    });


    return (
        <>
            {horizontalLines.map(({ begin, end }, index) => (

                <React.Fragment key={index}>
                    {index === 0 ? (
                        <>
                            <SteelBar x1={begin.x} x2={end.x} y={begin.y} label={label} isMain={true}
                                isAnchorBegin={true} isUp={isUp} anchorSize={_anchorSize} isAnchorEnd={false}> </SteelBar>
                        </>
                    ) : index === length - 1 ? (
                        <>
                            <SteelBar x1={begin.x} x2={end.x} y={begin.y} label={label} isMain={true}
                                isAnchorBegin={false} isUp={isUp} anchorSize={_anchorSize} isAnchorEnd={true}> </SteelBar>
                        </>
                    ) : (
                        <>
                            <SteelBar x1={begin.x} x2={end.x} y={begin.y} label={label} isMain={true}
                                isUp={isUp}> </SteelBar>
                        </>
                    )}
                </React.Fragment>
            ))}
        </>
    );
};


export default MainBar;
