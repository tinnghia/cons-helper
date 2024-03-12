import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import InputForm from "../InputForm";
import ResultForm from "../ResultForm";
import { OutputData } from "../models/OutputData";

export default function Home() {

    //CUTTING BAR
    const [outputData, setOutputData] = useState<OutputData>();
    const [isShowCuttingResult, SetIsShowCuttingResult] = useState(false);

    const [isShowLeft, SetIsShowLeft] = useState(true);
    const [inputWidth, setInputWidth] = useState('50%');
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
    const setIsResizing = (data: any) => {
        resizingRef.current = data;
        _setIsResizing(data);
    };
    const inputSectionRef = useRef<any>(null);
    const resultSectionRef = useRef<any>(null);

    const handleCuttingBack = () => {

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
            setInputWidth('50%');
            setResultWidth('50%');
            setSplitterCursor('col-resize');
            setSvgLeftDisplay('block');
            setSvgRightDisplay('none');
        } else {
            SetIsShowLeft(false);
            setInputWidth('0px');
            setResultWidth('100%');
            setSplitterCursor('pointer');
            setSvgLeftDisplay('none');
            setSvgRightDisplay('block');
        }
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
                <div className="input-section" id="inputSection" ref={inputSectionRef} style={{ width: inputWidth }}>
                    <InputForm onResult={onHandleCuttingResult} show={isShowLeft}></InputForm>
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
                            {isShowCuttingResult && (<ResultForm onBack={handleCuttingBack} methods={outputData?.methods || []} {...outputData} />
                            )}
                        </div>
                    </div>
                    <div id="history" className={activeTab === 'history' ? "tabcontent active" : "tabcontent"}>
                    </div>
                </div>
            </main>
        </div>
    );
}
