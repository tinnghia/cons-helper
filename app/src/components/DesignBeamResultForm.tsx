import React from 'react';
import "./DesignBeamResultForm.css";
import DrawBeam from '../DrawBeam';
import BeamCanvas from './BeamCanvas';
import { BeamOutputData } from '../models/BeamOutputData';

interface ResultFormProps extends BeamOutputData {
    onBack: (event: React.MouseEvent) => void;
}

const DesignBeamResultForm: React.FC<ResultFormProps> = (outputData) => {

    return (
        <BeamCanvas topBars={outputData.topBars} bottomBars={outputData.bottomBars} indexes={outputData.indexes} ></BeamCanvas>
    )
}

export default DesignBeamResultForm;
