import React from 'react';
import { BeamOutputData } from '../models/BeamOutputData';
import BeamCanvas from './BeamCanvas';
import "./DesignBeamResultForm.css";

interface ResultFormProps extends BeamOutputData {
    onBack: (event: React.MouseEvent) => void;
}

const DesignBeamResultForm: React.FC<ResultFormProps> = (outputData) => {

    return (
        <BeamCanvas topBars={outputData.topBars} bottomBars={outputData.bottomBars} indexes={outputData.indexes} ></BeamCanvas>
    )
}

export default DesignBeamResultForm;
