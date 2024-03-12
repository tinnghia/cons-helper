import React, { FunctionComponent, useState } from 'react';
import "./DesignBeamInputForm.css";
import { OutputData } from '../models/OutputData';

interface SpanLength {
    length: string;
}

const DesignBeamInputForm: FunctionComponent<{ show: boolean, onResult: (outputData: any) => void }> = ({ show, onResult }) => {
    const [unit, setUnit] = useState('mm');
    const [barLength, setBarLength] = useState<string>('');
    const [spans, setSpans] = useState<SpanLength[]>([]);
    const [error, setError] = useState<string>('');
    const [newLength, setNewLength] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);



    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUnit(e.target.value);
    };

    const handleBarLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setBarLength(newValue.toString());
        }
    };

    const handleNewLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setNewLength(newValue.toString());
        }
    };

    const handleDeleteSpan = (index: number) => {
        const updatedSpans = [...spans];
        updatedSpans.splice(index, 1);
        setSpans(updatedSpans);
    };

    const handleAddSpan = () => {
        console.log(spans)
        if (newLength == '')
            return;
        setSpans([...spans, { length: newLength }]);
        setNewLength('');

    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // Prepare data to be sent
        console.log(spans)
        setIsProcessing(true);
        const postData: any = {};
        console.log('postData', postData);
        onResult({});
        // POST data to the endpoint
        await fetch('http://localhost:8080/api/calculators/optimize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                onResult(data);
                setIsProcessing(false);
                console.log('Data posted successfully');
            })
            .catch(error => {
                setIsProcessing(false);
                console.error('There was a problem with your fetch operation:', error);
            });

    };

    return (
        <div className={show ? "bodyCls" : "bodyCls hide"}>
            <form className="bar-form">
                <div className='left-form'>
                    <div className="form-group">
                        <label htmlFor="unit">Unit:</label>
                        <select id="unit" value={unit} onChange={handleUnitChange}>
                            <option value="m">m</option>
                            <option value="mm">mm</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Diameter of main bar</label>
                        <input type="number" id="barLength" value={barLength} onChange={handleBarLengthChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Diameter of reinforcement bar</label>
                        <input type="number" id="barLength" value={barLength} onChange={handleBarLengthChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Lab Length(d)</label>
                        <input type="number" id="barLength" value={barLength} onChange={handleBarLengthChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Safe lapping Zone in top bar</label>
                        <input type="number" id="barLength" value={barLength} onChange={handleBarLengthChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Safe lapping Zone in bottom bar</label>
                        <input type="number" id="barLength" value={barLength} onChange={handleBarLengthChange} />
                    </div>
                </div>
                <div className='right-form'>
                    <div className="form-group">
                        <div className='inputSectionCls'>
                            <div className='inputSubSectionCls'>
                                <label>Span Length:</label>
                                <input type="number" className='inputNumberCls' value={newLength} onChange={handleNewLengthChange} />
                            </div>
                            <button type='button' onClick={handleAddSpan}>Add</button>
                        </div>

                        <div className="error-message">{error}</div>
                        <label>Spans (<span>{spans.length}</span>):</label>
                        <div className="scrollable-div">
                            {
                                spans.map((span, index) => (
                                    <div key={index} className='barItem'>
                                        <div className='barTextItem'>
                                            <span className='barLenghCls'>Span {index + 1}</span>
                                            <span>:</span>
                                            <span className='barNumberCls'>{span.length}</span>
                                        </div>
                                        <button type='button' onClick={() => handleDeleteSpan(index)} className='barItemBtn'>Delete</button>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <button type="button" onClick={handleSubmit} disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Design'}</button>
                </div>
            </form>

        </div>
    );
}

export default DesignBeamInputForm;