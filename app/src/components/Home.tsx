import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { BeamOutputData } from "../models/BeamOutputData";
import { OutputData } from "../models/OutputData";
import CuttingInputForm from "./CuttingInputForm";
import CuttingResultForm from "./CuttingResultForm";
import DesignBeamInputForm, { ADD_SPAN_ACTION, BeamDataProps, REMOVE_SPAN_ACTION } from "./DesignBeamInputForm";
import DesignBeamResultForm from "./DesignBeamResultForm";
import DesignBeamViewerForm from "./DesignBeamViewerForm";
import "./Home.css";
import ListBeam, { BeamNode } from "./ListBeam";

export default function Home() {

    const [beamList, setBeamList] = useState<BeamNode[]>([]);
    const [selectedBeam, setSelectedBeam] = useState<BeamNode>();

    //CUTTING BAR
    const [outputData, setOutputData] = useState<OutputData>();
    const [outputDesignData, setOutputDesignData] = useState<BeamOutputData>();
    const [isShowCuttingResult, SetIsShowCuttingResult] = useState(false);
    const [isShowDesignResult, SetIsShowDesignResult] = useState(false);

    const [isShowLeft, SetIsShowLeft] = useState(true);
    const [treeWidth, setTreeWidth] = useState('10%');
    const [inputWidth, setInputWidth] = useState('40%');
    const [resultWidth, setResultWidth] = useState('50%');
    const [splitterCursor, setSplitterCursor] = useState('col-resize');
    const [svgLeftDisplay, setSvgLeftDisplay] = useState('block');
    const [svgRightDisplay, setSvgRightDisplay] = useState('none');


    const [isShowUserContext, setIsShowUserContext] = useState(false);
    const [activeTool, setActiveTool] = useState('beam');
    const [activeTab, setActiveTab] = useState('result');

    const dropdownRef = useRef<any>(null);
    const userRef = useRef<any>(null);

    const [isResizing, _setIsResizing] = useState(false);
    const resizingRef = React.useRef(isResizing);

    const [findex, setFindex] = useState('first');
    const [lindex, setLindex] = useState('last');

    //indexes for beam viewer
    const [indexes, setIndexes] = useState<any>([]);
    const setIsResizing = (data: any) => {
        resizingRef.current = data;
        _setIsResizing(data);
    };
    const inputSectionRef = useRef<any>(null);
    const resultSectionRef = useRef<any>(null);

    const designBeamViewRef = useRef<any>(null);
    const listBeamRef = useRef<any>(null);

    const [showDialog, setShowDialog] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [showLoading, setShowLoading] = useState(false);

    const handleCuttingBack = () => {

    }

    const onHandleDesignResult = (outputData: BeamOutputData) => {
        setOutputDesignData(outputData);
        console.log('setOutputDesignData', outputData);
        setIndexes(outputData?.indexes);
        SetIsShowDesignResult(true);
    }

    const onHandleCuttingResult = (outputData: OutputData) => {
        setOutputData(outputData);
        SetIsShowCuttingResult(true);
    }
    const handleMouseDown = (event: any) => {
        setIsResizing(true);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event: any) => {
        if (!resizingRef.current) return;
        const inputWidth = event.clientX - inputSectionRef.current.getBoundingClientRect().left;
        inputSectionRef.current.style.width = inputWidth + 'px';
        resultSectionRef.current.style.width = `calc(100% - ${inputWidth}px)`;
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !userRef.current.contains(event.target)) {
                if (dropdownRef.current.classList.contains('active')) {
                    dropdownRef.current.classList.remove('active');
                    setIsShowUserContext(prevState => !prevState);
                }
            }
        };
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const selectSubTool = (tool: string) => {
        setActiveTool(tool);
    }

    const openTab = (tabName: string) => {
        setActiveTab(tabName);
    };
    const clickUser = () => {
        setIsShowUserContext(prevState => !prevState);
    }

    const toggleInputSection = () => {
        if (inputWidth === "0px" || inputWidth === "") {
            SetIsShowLeft(true);
            setTreeWidth('10%');
            setInputWidth('35%');
            setResultWidth('50%');
            setSplitterCursor('col-resize');
            setSvgLeftDisplay('block');
            setSvgRightDisplay('none');
        } else {
            SetIsShowLeft(false);
            setTreeWidth('0px');
            setInputWidth('0px');
            setResultWidth('100%');
            setSplitterCursor('pointer');
            setSvgLeftDisplay('none');
            setSvgRightDisplay('block');
        }
    }

    const onSpanAction = (action: string, span: any) => {
        let updatedIndexes;
        if (action === ADD_SPAN_ACTION) {
            setIndexes([...indexes, span]);
            updatedIndexes = [...indexes, span];
        } else if (action === REMOVE_SPAN_ACTION) {
            updatedIndexes = [...indexes];
            updatedIndexes.splice(span, 1);
            setIndexes(updatedIndexes);
        }

        if (designBeamViewRef.current) {
            designBeamViewRef.current.hanlleSpanAction(action, span, updatedIndexes);
        }
    }

    const onFirstIndexChange = (value: string) => {
        console.log('onFirstIndexChange', value)
        setFindex(value);
    }
    const onLastIndexChange = (value: string) => {
        console.log('onLastIndexChange', value)
        setLindex(value);
    }

    const handleBeamDataUpdate = (updatedBeamData: BeamNode[]) => {
        setBeamList(updatedBeamData);
    };

    const handleBeamSelectedChange = (node: BeamNode | undefined) => {
        console.log('handleBeamSelectedChange', node)
        setSelectedBeam(node);
    }

    const handleSaveBeam = (id: number, beam: BeamDataProps) => {
        if (listBeamRef) {
            listBeamRef.current.handleUpdateBeam(id, beam);
            setSaveStatus('success');
            setShowDialog(true);
        }
    }
    const handleCloseDialog = () => {
        setShowDialog(false);
        // Reset save status and status text if needed
        setSaveStatus('');
    };

    const handleRun = () => {
        setShowLoading(true);
    }

    return (
        <div className="container">
            <header>
                <div className="logo-holder logo-6">
                    <a href="">
                        <h3>Beam <span>Craft</span></h3>
                    </a>
                </div>
                <div className="user-info">
                    <a href="#" id="userButton" ref={userRef} className="tnb-signup-btn" onClick={clickUser}>Nghia</a>
                    <div id="userDropdown" ref={dropdownRef} className={isShowUserContext ? "userDropdown active" : "userDropdown"}>
                        <a href="#">Settings</a>
                        <a href="#">Logout</a>
                    </div>
                </div>
            </header>
            <nav>
                <ul id="subToolList">
                    <li><a href="#" className={activeTool === 'beam' ? "selected" : ""} onClick={() => selectSubTool('beam')}>Design Beam</a></li>
                    <li><a href="#" className={activeTool === 'cutting' ? "selected" : ""} onClick={() => selectSubTool('cutting')}>Cutting Bar</a></li>
                </ul>
            </nav>
            <main>
                <div className="left-column" style={{ border: '1px solid #ccc', borderRadius: '5px', width: treeWidth, padding: treeWidth === '0px' ? '0px' : '20px' }}>
                    <ListBeam show={isShowLeft} initBeamData={beamList} onBeamDataUpdate={handleBeamDataUpdate} onSelectedChange={handleBeamSelectedChange} ref={listBeamRef} onRun={handleRun}></ListBeam>
                </div>
                <div className="input-section" id="inputSection" ref={inputSectionRef} style={{ width: inputWidth, padding: inputWidth === '0px' ? '0px' : '20px' }}>
                    {selectedBeam && activeTool === 'beam' && <DesignBeamInputForm id={selectedBeam?.id} beam={selectedBeam?.beam} onResult={onHandleDesignResult} show={isShowLeft} onSpanAction={onSpanAction} onFirstIndexChange={onFirstIndexChange} onLastIndexChange={onLastIndexChange} onSave={handleSaveBeam} />}
                    {activeTool === 'cutting' && <CuttingInputForm onResult={onHandleCuttingResult} show={isShowLeft}></CuttingInputForm>}
                </div>
                <div className="splitter" id="splitter" onPointerDown={handleMouseDown}>
                    <button id="toggleButton" onClick={toggleInputSection} title="Toggle Input">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            className="splitter_left bi bi-arrow-bar-left" viewBox="0 0 16 16" style={{ display: svgLeftDisplay }}>
                            <path fillRule="evenodd"
                                d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            className="splitter_right bi bi-arrow-bar-right" viewBox="0 0 16 16" style={{ display: svgRightDisplay }}>
                            <path fillRule="evenodd"
                                d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5" />
                        </svg>
                    </button>

                </div>

                <div className="result-section" ref={resultSectionRef} style={{ width: resultWidth }}>
                    <div className="tab">
                        <button className={activeTab === 'result' ? "tablinks active" : "tablinks"} onClick={() => openTab('result')}>Result</button>
                        <button className={activeTab === 'history' ? "tablinks active" : "tablinks"} onClick={() => openTab('history')}>History</button>
                    </div>
                    <div id="result" className={activeTab === 'result' ? "tabcontent active" : "tabcontent"}>
                        <div id="result-text">
                            {isShowCuttingResult && (<CuttingResultForm onBack={handleCuttingBack} methods={outputData?.methods || []} {...outputData} />
                            )}

                            {isShowDesignResult && (<DesignBeamResultForm onBack={handleCuttingBack} topBars={outputDesignData?.topBars} bottomBars={outputDesignData?.bottomBars} indexes={outputDesignData?.indexes} />
                            )}
                            {selectedBeam && !isShowCuttingResult && !isShowDesignResult && activeTool === 'beam' && <DesignBeamViewerForm indexes={indexes} ref={designBeamViewRef} findex={findex} lindex={lindex} />}
                        </div>
                    </div>
                    <div id="history" className={activeTab === 'history' ? "tabcontent active" : "tabcontent"}>
                    </div>
                </div>


                {showDialog && (
                    <div className="dialog-overlay">
                        <div className="dialog">
                            <h2 style={{ color: saveStatus === 'success' ? 'green' : 'red', fontSize: '24px', marginBottom: '10px' }}>
                                {saveStatus === 'success' ? 'Success' : 'Error'}
                            </h2>
                            <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.5' }}>
                                {saveStatus === 'success' ? 'Save Beam successful!' : 'Save failed. Please try again.'}
                            </p>
                            <button onClick={handleCloseDialog} style={{ marginTop: '20px' }}>Close</button>
                        </div>
                    </div>
                )}

                {showLoading && (
                    <div className="loading-dialog">
                        <div className="loading-content">
                            <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '24px', color: '#007bff' }} />
                            <span style={{ marginLeft: '0.5em', fontSize: '18px', color: '#007bff' }}>Processing...</span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );


}
