import React from 'react';
import { BeamOutputData } from '../models/BeamOutputData';
import BeamCanvas from './BeamCanvas';
import "./DesignBeamResultForm.css";

interface ResultFormProps {
    beam?: BeamOutputData;
    onBack: (event: React.MouseEvent) => void;
}

const DesignBeamResultForm: React.FC<ResultFormProps> = (outputData) => {

    return (
        <BeamCanvas topBars={outputData.beam?.topBars} bottomBars={outputData.beam?.bottomBars} indexes={outputData.beam?.indexes} ></BeamCanvas>
    )
}

export default DesignBeamResultForm;
