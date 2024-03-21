import React, { FunctionComponent, useState } from 'react';
import "./DesignBeamInputForm.css";
import RebarList from './RebarList';

interface SpanLength {
    length: string;
}

interface BeamInputFormProps {
    show: boolean,
    onResult: (outputData: any) => void,
    onSpanAction: (action: string, span: any) => void
    onFirstIndexChange: (value: string) => void,
    onLastIndexChange: (value: string) => void
}

export const ADD_SPAN_ACTION = 'add';
export const REMOVE_SPAN_ACTION = 'remove';


const options = [
    { value: '1', label: 'image1.png', image: 'image1.png' },
    { value: '2', label: 'image2.png', image: 'image2.png' },
    { value: '3', label: 'image3.png', image: 'image3.png' }
];

// Sample data for the accordition
const initRebarList = [
    {
        id: 1,
        name: 'Rebar 1',
        value: '100',
        columnIndex: 'column1'
    },
    {
        id: 2,
        name: 'Rebar 2',
        value: '100',
        columnIndex: 'column2'
    }
];


const DesignBeamInputForm: FunctionComponent<BeamInputFormProps> = ({ show, onResult, onSpanAction, onFirstIndexChange, onLastIndexChange }) => {
    const [unit, setUnit] = useState('mm');
    const [findex, setFindex] = useState('first');
    const [sindex, setSindex] = useState('last');
    const [standardBarLength, setStandardBarLength] = useState<string>('11700');
    const [labLength, setLabLength] = useState<string>('30');
    const [anchorLength, setAnchorLength] = useState<string>('15');
    const [mainBarDiameter, setMainBarDiameter] = useState<string>('22');
    const [rifBarDiameter, setRifBarDiameter] = useState<string>('18');
    const [topSafeZoneAwayFromColumn, setTopSafeZoneAwayFromColumn] = useState<string>('0.25');
    const [bottomSafeZoneFromColumn, setBottomSafeZoneFromColumn] = useState<string>('0.25');
    const [topMainBars, setTopMainBars] = useState<string>('');
    const [bottomMainBars, setBottomMainBars] = useState<string>('');

    const [spans, setSpans] = useState<SpanLength[]>([]);
    const [error, setError] = useState<string>('');
    const [newLength, setNewLength] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState('common');
    const [expandedColumnIndex, setExpandedColumnIndex] = useState('');



    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUnit(e.target.value);
    };

    const handleFindexChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFindex(e.target.value);
        onFirstIndexChange(e.target.value);
    };

    const handleSindexChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSindex(e.target.value);
        onLastIndexChange(e.target.value);
    };

    const handleBarLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setStandardBarLength(newValue.toString());
        }
    };
    const handleLabLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setLabLength(newValue.toString());
        }
    };
    const handleAnchorLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setAnchorLength(newValue.toString());
        }
    };

    const handleMainBarDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setMainBarDiameter(newValue.toString());
        }
    };

    const handleRifBarDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setRifBarDiameter(newValue.toString());
        }
    };

    const handleTopSafeZoneAwayFromColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setTopSafeZoneAwayFromColumn(newValue.toString());
        }
    };

    const handleBottomSafeZoneFromColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setBottomSafeZoneFromColumn(newValue.toString());
        }
    };

    const handleTopMainBarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setTopMainBars(newValue.toString());
        }
    };

    const handleBottomMainBarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setBottomMainBars(newValue.toString());
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
        onSpanAction(ADD_SPAN_ACTION, index);
    };

    const handleAddSpan = () => {
        console.log(spans)
        if (newLength == '')
            return;
        setSpans([...spans, { length: newLength }]);
        setNewLength('');
        onSpanAction(ADD_SPAN_ACTION, newLength);

    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // Prepare data to be sent
        console.log(spans)
        setIsProcessing(true);
        const postData: any = {};
        postData['unit'] = unit;
        postData['standardBarLength'] = parseInt(standardBarLength);
        postData['mainBarDiameter'] = parseInt(mainBarDiameter);
        postData['rifBarDiameter'] = parseInt(rifBarDiameter);
        postData['labLength'] = parseInt(labLength);
        postData['anchorLength'] = parseInt(anchorLength);
        postData['topMainBars'] = parseInt(topMainBars);
        postData['bottomMainBars'] = parseInt(bottomMainBars);
        postData['topSafeZoneAwayFromColumn'] = parseFloat(topSafeZoneAwayFromColumn);
        postData['bottomSafeZoneFromColumn'] = parseFloat(bottomSafeZoneFromColumn);
        postData['firstColumnIndex'] = findex === 'first+1' ? 1 : 0;
        postData['lastColumnIndex'] = sindex === 'last-1' ? spans.length - 2 : spans.length - 1;
        let lspans = [];
        for (var i = 0; i < spans.length; i++) {
            lspans.push(parseInt(spans[i].length));
        }
        console.log('spansspansspans', spans)
        postData['spans'] = lspans;
        console.log('postData', postData);
        // POST data to the endpoint
        await fetch('http://localhost:8080/api/calculators/design', {
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
                console.log('result', data);
                onResult(data);
                setIsProcessing(false);
                console.log('Data posted successfully');
            })
            .catch(error => {
                setIsProcessing(false);
                console.error('There was a problem with your fetch operation:', error);
            });

    };

    const openTab = (tabName: string) => {
        setActiveTab(tabName);
    };

    return (
        <div className={show ? "bodyCls" : "bodyCls hide"}>
            <div className="tab">
                <button className={activeTab === 'common' ? "tablinks active" : "tablinks"} onClick={() => openTab('common')}>COMMON PROPERTIES</button>
                <button className={activeTab === 'span' ? "tablinks active" : "tablinks"} onClick={() => openTab('span')}>DESIGN SPAN</button>
                <button className={activeTab === 'rebar' ? "tablinks active" : "tablinks"} onClick={() => openTab('rebar')}>Design Rebar</button>
            </div>
            <form className="bar-form">
                <div className={`left-form ${activeTab === 'common' ? 'show' : ''}`}>
                    <div className="form-group">
                        <label htmlFor="unit">Unit:</label>
                        <select id="unit" value={unit} onChange={handleUnitChange}>
                            <option value="m">m</option>
                            <option value="mm">mm</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Diameter of main bar</label>
                        <input type="number" id="mainBarDiameter" value={mainBarDiameter} onChange={handleMainBarDiameterChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Diameter of Rebar</label>
                        <input type="number" id="rifBarDiameter" value={rifBarDiameter} onChange={handleRifBarDiameterChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Standard Bar Length</label>
                        <input type="number" id="standardBarLength" value={standardBarLength} onChange={handleBarLengthChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Lab Length(d)</label>
                        <input type="number" id="labLength" value={labLength} onChange={handleLabLengthChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Anchor Length(d)</label>
                        <input type="number" id="anchorLength" value={anchorLength} onChange={handleAnchorLengthChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Safe lapping Zone in top bar</label>
                        <input type="number" id="topSafeZoneAwayFromColumn" value={topSafeZoneAwayFromColumn} onChange={handleTopSafeZoneAwayFromColumnChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Safe lapping Zone in bottom bar</label>
                        <input type="number" id="bottomSafeZoneFromColumn" value={bottomSafeZoneFromColumn} onChange={handleBottomSafeZoneFromColumnChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Number of top bars</label>
                        <input type="number" id="topMainBars" value={topMainBars} onChange={handleTopMainBarsChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barLength">Number of bottom bars</label>
                        <input type="number" id="bottomMainBars" value={bottomMainBars} onChange={handleBottomMainBarsChange} />
                    </div>
                </div>
                <div className={`right-form ${activeTab === 'span' ? 'show' : ''}`} >
                    <div className="form-group columnIndexCls">
                        <label htmlFor="barLength">First Column Index</label>
                        <select id="findex" value={findex} onChange={handleFindexChange}>
                            <option value="first+1">First+1</option>
                            <option value="first">First</option>
                        </select>
                    </div>
                    <div className="form-group columnIndexCls">
                        <label htmlFor="barLength">Second Column Index</label>
                        <select id="sindex" value={sindex} onChange={handleSindexChange}>
                            <option value="last-1">Last-1</option>
                            <option value="last">Last</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <div className='inputSectionCls'>
                            <div className='inputSubSectionCls'>
                                <label>Span Length:</label>
                                <input type="number" className='inputNumberCls' value={newLength} onChange={handleNewLengthChange} />
                            </div>
                            <div className="buttonSectionCls">
                                <button type='button' onClick={handleAddSpan}>Add</button>
                            </div>
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

                <div className={`right-form ${activeTab === 'rebar' ? 'show' : ''}`} >
                    <div className="form-group">
                        <div className="inputRebarCls">
                            <div className="inputGroup1">
                                <label id="columnIndex">Column</label>
                                <select id="columnIndex" className="smallSelect">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                                <label id="position">Position</label>
                                <select id="position" className="smallSelect">
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                </select>
                                <label id="rebarType">Type</label>
                                <select id="rebarType" className="smallSelect">
                                    <option value="1">|---</option>
                                    <option value="2">---|---</option>
                                    <option value="3">---|-</option>
                                </select>
                            </div>
                            <div className="inputGroup2">
                                <label id="length">Length</label>
                                <input type="number" id="length" value="1" />
                                <label id="number">Number</label>
                                <input type="number" id="number" value="1" />
                            </div>
                            <div className="buttonSectionCls">
                                <button type="button">Add</button>
                            </div>
                        </div>




                        <div className="error-message">{error}</div>
                        <RebarList barItems={initRebarList} expandedColumnIndex={expandedColumnIndex}></RebarList>
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