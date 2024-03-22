import React, { FunctionComponent, useState } from 'react';
import "./CuttingInputForm.css";
import { OutputData } from '../models/OutputData';
import appConfig from '../config/config.json';

interface DividedBar {
    length: string;
    numberOfBars: string;
}

const CuttingInputForm: FunctionComponent<{ show: boolean, onResult: (outputData: OutputData) => void }> = ({ show, onResult }) => {
    const [unit, setUnit] = useState('M');
    const [barLength, setBarLength] = useState<string>('');
    const [dividedBars, setDividedBars] = useState<DividedBar[]>([]);
    const [error, setError] = useState<string>('');
    const [newLength, setNewLength] = useState<string>('');
    const [newNumberOfBars, setNewNumberOfBars] = useState<string>('');
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
    const handleNewNumberOfBarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setNewNumberOfBars(newValue.toString());
        }
    };

    const handleDeleteDividedBar = (index: number) => {
        const updatedDividedBars = [...dividedBars];
        updatedDividedBars.splice(index, 1);
        setDividedBars(updatedDividedBars);
    };

    const handleAddDividedBar = () => {
        if (newLength == '' || newNumberOfBars == '')
            return;
        if (dividedBars.filter(n => n["length"] == newLength).length > 1) {
            setError('Duplicate "' + newLength + '", please enter a unique value.');
        } else {
            setError('');
            setDividedBars([...dividedBars, { length: '', numberOfBars: '' }]);
        }
        setDividedBars([...dividedBars, { length: newLength, numberOfBars: newNumberOfBars }]);
        setNewLength('');
        setNewNumberOfBars('');

    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // Prepare data to be sent
        setIsProcessing(true);
        const postData: any = {};
        postData['unit'] = unit;
        postData['bar_length'] = parseFloat(barLength);
        postData['subs'] = [];
        for (var i = 0; i < dividedBars.length; i++) {
            postData['subs'].push({ 'length': parseFloat(dividedBars[i].length), 'total': parseFloat(dividedBars[i].numberOfBars) })
        }
        console.log('postData', postData);
        // POST data to the endpoint
        await fetch(`${appConfig.backendUrl}/api/calculators/optimize`, {
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
                            <option value="m">M</option>
                            <option value="cm">CM</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Length of Bar:</label>
                        <input type="number" id="barLength" value={barLength} onChange={handleBarLengthChange} />
                    </div>
                </div>
                <div className='cutting-right-form'>
                    <div className="form-group">
                        <div className='inputSectionCls'>
                            <div className='inputSubSectionCls'>
                                <label>Length:</label>
                                <input type="number" className='inputNumberCls' value={newLength} onChange={handleNewLengthChange} />
                            </div>
                            <div className='inputSubSectionCls'>
                                <label>Number:</label>
                                <input type="number" className='inputNumberCls' value={newNumberOfBars} onChange={handleNewNumberOfBarsChange} />
                            </div>
                            <button type='button' onClick={handleAddDividedBar}>Add</button>
                        </div>

                        <div className="error-message">{error}</div>
                        <label>Divided Bars (<span>{dividedBars.length}</span>):</label>
                        <div className="scrollable-div">
                            {
                                dividedBars.map((dividedBar, index) => (
                                    <div key={index} className='barItem'>
                                        <div className='barTextItem'>
                                            <span className='barLenghCls'>{dividedBar.length}</span>
                                            <span>x</span>
                                            <span className='barNumberCls'>{dividedBar.numberOfBars}</span>
                                        </div>
                                        <button type='button' onClick={() => handleDeleteDividedBar(index)} className='barItemBtn'>Delete</button>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <button type="button" onClick={handleSubmit} disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Process'}</button>
                </div>
            </form>

        </div>
    );
}

export default CuttingInputForm;