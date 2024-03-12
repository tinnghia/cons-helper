import React from 'react';
import "./DesignBeamResultForm.css";
import { OutputData } from '../models/OutputData';
import DrawBeam from '../DrawBeam';

interface ResultFormProps extends OutputData {
    onBack: (event: React.MouseEvent) => void;
}

const DesignBeamResultForm: React.FC<ResultFormProps> = (OutputData) => {

    return (
        <DrawBeam></DrawBeam>
    )
}

export default DesignBeamResultForm;
