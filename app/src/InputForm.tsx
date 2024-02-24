import React, { useState } from 'react';
import "./InputForm.css";
import ResultForm from './ResultForm';
import ResultFormPure from './ResultFormPure';
function InputForm() {
    const [unit, setUnit] = useState('M');
    const [barLength, setBarLength] = useState('');
    const [dividedBars, setDividedBars] = useState(['']);
    const [error, setError] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [htmlResult, setHtmlResult] = useState('');


    const handleUnitChange = (e: any) => {
        setUnit(e.target.value);
    };

    const handleBarLengthChange = (e: any) => {
        setBarLength(e.target.value);
    };

    const handleDividedBarChange = (index: any, value: any) => {
        const newDividedBars = [...dividedBars];
        newDividedBars[index] = value;
        setDividedBars(newDividedBars);
    };

    const handleAddDividedBar = () => {
        console.log(dividedBars, dividedBars[dividedBars.length - 1])
        if (dividedBars[dividedBars.length - 1] == '')
            return;
        if (dividedBars.filter(n => n == dividedBars[dividedBars.length - 1]).length > 1) {
            setError('Duplicate "' + dividedBars[dividedBars.length - 1] + '", please enter a unique value.');
        } else {
            setError('');
            setDividedBars([...dividedBars, barLength]);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Prepare data to be sent
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
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setHtmlResult(data.html);
                setShowResult(true);
                console.log('Data posted successfully');
            })
            .catch(error => {
                // Handle error
                console.error('There was a problem with your fetch operation:', error);
            });

    };

    return (
        <div>
            {!showResult ? (
                <form onSubmit={handleSubmit} className="bar-form">
                    <div className='left-form'>
                        <div className="form-group">
                            <label htmlFor="unit">Unit:</label>
                            <select id="unit" value={unit} onChange={handleUnitChange}>
                                <option value="M">M</option>
                                <option value="CM">CM</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="barLength">Length of Bar:</label>
                            <input type="number" id="barLength" value={barLength} onChange={handleBarLengthChange} />
                        </div>
                    </div>
                    <div className='right-form'>
                        <div className="form-group">
                            <label>Divided Bars (<span>{dividedBars.length}</span> items):</label>
                            <div className="scrollable-div">
                                {dividedBars.map((dividedBar, index) => (
                                    <input
                                        key={index}
                                        type="number"
                                        value={dividedBar}
                                        onChange={(e) => handleDividedBarChange(index, e.target.value)}
                                    />
                                ))}
                            </div>
                            <button type="button" onClick={handleAddDividedBar}>Add</button>
                            <div className="error-message">{error}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="submit">Process</button>
                    </div>
                </form>
            ) : (
                <ResultFormPure />
            )}
        </div>
    );
}

export default InputForm;