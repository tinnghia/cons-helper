import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import "./DesignBeamInputForm.css";
import RebarList from './RebarList';

interface SpanLength {
    length: string;
}

interface BeamInputFormProps {
    id?: number;
    show: boolean,
    onResult: (outputData: any) => void,
    onSpanAction: (action: string, span: any) => void
    onFirstIndexChange: (value: string) => void,
    onLastIndexChange: (value: string) => void,
    beam?: BeamDataProps,
    onSave: (id: number, beam: BeamDataProps) => void;
}

export const ADD_SPAN_ACTION = 'add';
export const REMOVE_SPAN_ACTION = 'remove';



export interface RebarProps {
    length: string;
    number: string;
    position: string;
    type: string;
    columnIndex: string;
    dia: string;
}

export interface BeamDataProps {
    unit: string;
    standardBarLength?: string;
    mainBarDiameter: string;
    rifBarDiameter: string
    labLength: string;
    anchorLength: string;
    topMainBars: string
    bottomMainBars: string
    topSafeZoneAwayFromColumn: string;
    bottomSafeZoneFromColumn: string;
    firstColumnIndex: string;
    lastColumnIndex: string;
    spans: any[];
    rebars: RebarProps[]
}

const DesignBeamInputForm = forwardRef<any, BeamInputFormProps>(({ id, beam, show, onResult, onSpanAction, onFirstIndexChange, onLastIndexChange, onSave }, ref) => {
    const [unit, setUnit] = useState<string>(beam?.unit ?? '');
    const [findex, setFindex] = useState<string>(beam?.firstColumnIndex ?? '');
    const [sindex, setSindex] = useState<string>(beam?.lastColumnIndex ?? '');
    const [standardBarLength, setStandardBarLength] = useState<string>(beam?.standardBarLength ?? '');
    const [labLength, setLabLength] = useState<string>(beam?.labLength ?? '');
    const [anchorLength, setAnchorLength] = useState<string>(beam?.anchorLength ?? '');
    const [mainBarDiameter, setMainBarDiameter] = useState<string>(beam?.mainBarDiameter ?? '');
    const [rifBarDiameter, setRifBarDiameter] = useState<string>(beam?.rifBarDiameter ?? '');
    const [topSafeZoneAwayFromColumn, setTopSafeZoneAwayFromColumn] = useState<string>(beam?.topSafeZoneAwayFromColumn ?? '');
    const [bottomSafeZoneFromColumn, setBottomSafeZoneFromColumn] = useState<string>(beam?.bottomSafeZoneFromColumn ?? '');
    const [topMainBars, setTopMainBars] = useState<string>('');
    const [bottomMainBars, setBottomMainBars] = useState<string>('');

    const [spans, setSpans] = useState<SpanLength[]>([]);
    const [error, setError] = useState<string>('');
    const [newLength, setNewLength] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState('common');

    /*** REBAR ***/
    const [expandedColumnIndex, setExpandedColumnIndex] = useState('');
    const [rebarPosition, setRebarPosition] = useState('top');
    const [rebarType, setRebarType] = useState('1');
    const [rebarLength, setRebarLength] = useState('');
    const [rebarNumber, setRebarNumber] = useState('1');
    const [rebarDia, setRebarDia] = useState('1');
    const [rebarList, setRebarList] = useState<RebarProps[]>([]);

    const [isModified, setIsModified] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUnit(e.target.value);
        setIsModified(true);

    };

    const handleFindexChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFindex(e.target.value);
        onFirstIndexChange(e.target.value);
        setIsModified(true);

    };

    const handleSindexChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSindex(e.target.value);
        onLastIndexChange(e.target.value);
        setIsModified(true);

    };

    const handleBarLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setStandardBarLength(newValue.toString());
            setIsModified(true);
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
            setIsModified(true);
        }
    };

    const handleMainBarDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setMainBarDiameter(newValue.toString());
            setIsModified(true);
        }
    };

    const handleRifBarDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setRifBarDiameter(newValue.toString());
            setIsModified(true);
        }
    };

    const handleTopSafeZoneAwayFromColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setTopSafeZoneAwayFromColumn(newValue.toString());
            setIsModified(true);
        }
    };

    const handleBottomSafeZoneFromColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setBottomSafeZoneFromColumn(newValue.toString());
            setIsModified(true);
        }
    };

    const handleTopMainBarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setTopMainBars(newValue.toString());
            setIsModified(true);
        }
    };

    const handleBottomMainBarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setBottomMainBars(newValue.toString());
            setIsModified(true);
        }
    };

    const handleNewLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setNewLength(newValue.toString());
            setIsModified(true);
        }
    };

    const handleDeleteSpan = (index: number) => {
        const updatedSpans = [...spans];
        updatedSpans.splice(index, 1);
        setSpans(updatedSpans);
        onSpanAction(REMOVE_SPAN_ACTION, index);
        setIsModified(true);
    };

    const handleAddSpan = () => {
        if (newLength == '')
            return;
        setSpans([...spans, { length: newLength }]);
        setNewLength('');
        setExpandedColumnIndex((spans.length - 1).toString());
        onSpanAction(ADD_SPAN_ACTION, newLength);
        setIsModified(true);

    };

    /*** REBAR events */
    const handleRebarTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRebarType(e.target.value);
        setIsModified(true);
    };

    const handleRebarPositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRebarPosition(e.target.value);
        setIsModified(true);
    };

    const handleColumnIndexChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setExpandedColumnIndex(e.target.value);
        setIsModified(true);
    };

    const handleRebarNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setRebarNumber(newValue.toString());
            setIsModified(true);
        }
    };

    const handleRebarDiaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseInt(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setRebarDia(newValue.toString());
            setIsModified(true);
        }
    };

    const handleAddRebar = () => {
        if (expandedColumnIndex === '' || rebarLength === '' || rebarNumber === '')
            return;
        setRebarList([...rebarList, {
            length: rebarLength, columnIndex: expandedColumnIndex,
            number: rebarNumber, position: rebarPosition, type: rebarType, dia: rebarDia
        }]);
        setIsModified(true);

    };
    const handleRebarLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setBarLength(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (newValue >= 0 || isNaN(newValue)) {
            setRebarLength(newValue.toString());
            setIsModified(true);
        }
    };
    const handleSave = (e: any) => {
        if (beam) {
            beam.unit = unit;
            beam.standardBarLength = standardBarLength;
            beam.mainBarDiameter = mainBarDiameter;
            beam.rifBarDiameter = rifBarDiameter;
            beam.labLength = labLength;
            beam.anchorLength = anchorLength;
            beam.topMainBars = topMainBars;
            beam.bottomMainBars = bottomMainBars;
            beam.topSafeZoneAwayFromColumn = topSafeZoneAwayFromColumn;
            beam.bottomSafeZoneFromColumn = bottomSafeZoneFromColumn;
            beam.firstColumnIndex = findex;
            beam.lastColumnIndex = sindex;
            beam.spans = spans;
            beam.rebars = rebarList;

            onSave(id ? id : 0, beam);

        }
        setIsModified(false);

    };

    const openTab = (tabName: string) => {
        setActiveTab(tabName);
    };

    const checkModified = () => {
        return isModified;
    };

    useImperativeHandle(ref, () => ({
        handleSave: handleSave,
        checkModified: checkModified
    }));

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            if (activeTab === 'span')
                handleAddSpan();
            else if (activeTab === 'rebar') {
                handleAddRebar();
            }
        }
    };

    useEffect(() => {
        // Do something with beam (e.g., render the form based on beam)
        setSpans(beam ? beam.spans : []);
        setRebarList(beam ? beam.rebars : []);
        setTopMainBars(beam ? beam.topMainBars : '');
        setBottomMainBars(beam ? beam.bottomMainBars : '');
    }, [beam]);
    return (
        <div className={show ? "bodyCls" : "bodyCls hide"} onKeyDown={handleKeyPress}>
            <div className="tab">
                <button className={activeTab === 'common' ? "tablinks active" : "tablinks"} onClick={() => openTab('common')}>COMMON PROPERTIES</button>
                <button className={activeTab === 'span' ? "tablinks active" : "tablinks"} onClick={() => openTab('span')}>DESIGN SPAN</button>
                <button className={activeTab === 'rebar' ? "tablinks active" : "tablinks"} onClick={() => openTab('rebar')}>Design Rebar</button>
                <div className='saveBtnContainer'>
                    <button onClick={handleSave} title='Save' className={"saveBtn"} disabled={!isModified}>
                        <FaSave size={18}></FaSave>
                    </button>
                </div>
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
                                <label id="expandedColumnIndex_label">Column</label>
                                <select id="expandedColumnIndex" className="smallSelect" value={expandedColumnIndex} onChange={handleColumnIndexChange}>
                                    {spans.map((span, index) => (
                                        <option key={index} value={index}>{index + 1}</option>
                                    ))}

                                </select>
                                <label id="rebarPosition_label">Position</label>
                                <select id="rebarPosition" className="smallSelect" value={rebarPosition} onChange={handleRebarPositionChange}>
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                </select>
                                <label id="rebarType_label">Type</label>
                                <select id="rebarType" className="smallSelect" value={rebarType} onChange={handleRebarTypeChange}>
                                    <option value="1">|---</option>
                                    <option value="2">---|---</option>
                                    <option value="3">---|-</option>
                                    <option value="4">-|----</option>
                                    <option value="5">| -- |</option>
                                </select>
                            </div>
                            <div className="inputGroup2">
                                <label id="rebarLength_label">Length</label>
                                <input type="number" id="rebarLength" value={rebarLength} onChange={handleRebarLengthChange} />
                                <label id="rebarNumber_label">Number</label>
                                <input type="number" id="rebarNumber" value={rebarNumber} onChange={handleRebarNumberChange} />
                                <label id="rebarDia_label">Dia</label>
                                <input type="number" id="rebarDia" value={rebarDia} onChange={handleRebarDiaChange} />
                            </div>
                            <div className="buttonSectionCls">
                                <button type="button" onClick={handleAddRebar}>Add</button>
                            </div>
                        </div>




                        <div className="error-message">{error}</div>
                        <RebarList barItems={rebarList} expandedColumnIndex={expandedColumnIndex}></RebarList>
                    </div>
                </div>
                {/*<div className="form-group">
                    <button type="button" onClick={handleSave}>Save</button>
                                    </div>*/}
            </form>
        </div>
    );
})

export default DesignBeamInputForm;