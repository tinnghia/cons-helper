import React, { useState } from 'react';
import "./InputForm.css";
import ResultForm from './ResultForm';
import { OutputData } from './models/OutputData';

interface DividedBar {
    length: string;
    numberOfBars: string;
}

function InputForm() {
    const [unit, setUnit] = useState('M');
    const [barLength, setBarLength] = useState<string>('');
    const [dividedBars, setDividedBars] = useState<DividedBar[]>([]);
    const [error, setError] = useState<string>('');
    const [showResult, setShowResult] = useState(false);
    const [htmlResult, setHtmlResult] = useState<string>('');
    const [newLength, setNewLength] = useState<string>('');
    const [newNumberOfBars, setNewNumberOfBars] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [outputData, setOutputData] = useState<OutputData>();



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
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        //console.log(newValue);
        if (newValue >= 0 || isNaN(newValue)) {
            setNewLength(newValue.toString());
        }
    };
    const handleNewNumberOfBarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
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
        console.log(dividedBars)
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

    const handleBack = () => {
        setShowResult(false); // Hide ResultForm
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // Prepare data to be sent
        console.log(dividedBars)
        setIsProcessing(true);
        const postData: any = {};
        postData['unit'] = unit;
        postData['bar_length'] = parseFloat(barLength);
        postData['subs'] = [];
        for (var i = 0; i < dividedBars.length; i++) {
            postData['subs'].push({ 'length': parseFloat(dividedBars[i].length), 'total': parseFloat(dividedBars[i].numberOfBars) })
        }
        console.log('postData', postData);
        const data = {
            "unit": "m",
            "bar_length": 11.7,
            "subs": [
                {
                    "length": 1.2,
                    "total": 3
                },
                {
                    "length": 2.2,
                    "total": 4
                }
            ]
        }
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
                console.log('data', data);
                /*data.displayDividedBars = dividedBars.map(bar => bar.length).join(', ');
                for (var i = 0; i < data.methods.length; i++) {
                    let displayRemain = data.methods[i].set.filter((sps: any) => sps.remain_per_each > 0).
                        map((sps: any) => { return sps.total + ' * ' + sps.remain_per_each }).join(', ')
                    data.methods[i].displayRemain = displayRemain;
                    for (var j = 0; j < data.methods[i].set.length; j++) {
                        let displaySplit = data.methods[i].set[j].split.filter((split: any) => split.total > 0).
                            map((split: any) => { return split.total + ' * ' + split.length }).join(', ');
                        data.methods[i].set[j].displaySplit = displaySplit;

                    }
                }*/
                setOutputData(data);
                setHtmlResult(data.html);
                setShowResult(true);
                setIsProcessing(false);
                console.log('Data posted successfully');
            })
            .catch(error => {
                // Handle error
                setIsProcessing(false);
                console.error('There was a problem with your fetch operation:', error);
            });

    };

    return (
        <div className='bodyCls'>
            {!showResult ? (
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
                    <div className='right-form'>
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
            ) : (
                <ResultForm onBack={handleBack} methods={outputData?.methods || []} {...outputData} />
            )}
        </div>
    );
}

export default InputForm;