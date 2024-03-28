import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { BeamOutputData } from '../models/BeamOutputData';
import BeamCanvas from './BeamCanvas';
import "./DesignBeamResultForm.css";

interface ResultFormProps {
    beam?: BeamOutputData;
    onBack: (event: React.MouseEvent) => void;
}

const DesignBeamResultForm = forwardRef<any, ResultFormProps>((outputData, ref) => {

    const beamCanvasRef = useRef<any>(null);
    useImperativeHandle(ref, () => ({
        handleMoveTo: handleMoveTo
    }));

    const handleMoveTo = (spanIndex: string) => {
        if(beamCanvasRef && beamCanvasRef.current) {
            beamCanvasRef.current.handleMoveTo(spanIndex);
        }
    }
    /*useEffect(() => {

    }, [outputData]);*/
    return (
        <BeamCanvas topBars={outputData.beam?.topBars} bottomBars={outputData.beam?.bottomBars} indexes={outputData.beam?.indexes} ref={beamCanvasRef}></BeamCanvas>
    )
});

export default DesignBeamResultForm;
