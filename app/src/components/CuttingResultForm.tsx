import React from 'react';
import "./CuttingResultForm.css";
import { OutputData } from '../models/OutputData';

interface ResultFormProps extends OutputData {
    onBack: (event: React.MouseEvent) => void;
}

const CuttingResultForm: React.FC<ResultFormProps> = (OutputData) => {
    const handleDownload = async (e: any) => {
        e.preventDefault();
        try {
            // Make a GET request to the server to download the file
            const response = await fetch(`http://localhost:8080/api/calculators/doc/${OutputData.workId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/octet-stream', // Set appropriate content type
                },
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;

            const contentDispositionHeader = response.headers.get('Content-Disposition');
            const filename = contentDispositionHeader ? contentDispositionHeader.split('filename=')[1] : 'downloaded_file';

            // Set the filename for download
            link.setAttribute('download', filename);

            // Append the link to the body
            document.body.appendChild(link);

            // Click the link to start download
            link.click();

            // Remove the link from the body
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div className='result-form'>
            <div className="form-group">
                {/*<button type="button" onClick={OutputData.onBack} >Back</button>*/} <button type="button" onClick={handleDownload} >Download</button>
            </div>
            <h2>Input</h2>
            <div className="indent">
                <label className='bold-label'>Unit: {OutputData.unit}</label>
            </div>
            <div className="indent">
                <label className='bold-label'>Size length of Standard bar: {OutputData.bar_length}</label>
            </div>
            <div className="indent">
                <label className='bold-label'>Size length of each devided bar: {OutputData.displayDividedBars}</label>
            </div>
            <h2>Output</h2>
            <div className="indent">
                <label className='bold-label'>The minimum number of standard bars needed:</label> {OutputData.min_bars}
            </div>
            <div className="indent">
                <label className='bold-label'>DIVIDING METHOD</label>
                {OutputData.methods.map((splitMethod, index) => (
                    <div className="indent" key={index}>
                        <label className='bold-label'> METHOD {index}</label>
                        <ul className="indent">
                            {splitMethod.set.map((splitSet, index) => (
                                <li key={index}>{splitSet.total} * (Each bar is divided into segments of {splitSet.displaySplit})</li>
                            ))}
                        </ul>
                        <p> <label className='bold-label'>Remaining segments:</label> {splitMethod.displayRemain}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CuttingResultForm;
