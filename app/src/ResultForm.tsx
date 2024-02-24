import React, { FunctionComponent } from 'react';
import "./ResultForm.css"

const ResultForm: FunctionComponent<{ html: string }> = ({ html }) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default ResultForm;