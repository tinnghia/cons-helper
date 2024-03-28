import { FC, useEffect, useState } from "react";
import { BeamOutputData } from "../models/BeamOutputData";
import "./BeamTableForm.css";
interface BeamTableFormProps {
    beamList: BeamSolution[];
    onSelect: (beam: BeamOutputData) => void;
    onClickSpan: (spanId: string) => void;
}

interface BeamSolution {
    barQueue: BarQueue;
    unit: string;
    outputDataList: BeamOutputData[]
}

export interface SpanBar {
    length: number;
    index: number;
    subIndex: number;
    used: boolean;
}
interface BarQueue {
    currentParentIndex: number;
    remainingSpanBars: SpanBar[];
    usingSpanBars: SpanBar[];

}

const BeamTableForm: FC<BeamTableFormProps> = ({ beamList, onSelect, onClickSpan }) => {
    const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0);
    const [selectedSolution, setSelectedSolution] = useState<BeamSolution | null>(null);
    const [selectedBarQueue, setSelectedBarQueue] = useState<BarQueue | null>(null);
    const [spanBars, setSpanBars] = useState<SpanBar[][] | null>(null);
    const [maxColumns, setMaxColumns] = useState(0);
    const [selectedBeam, setSelectedBeam] = useState<BeamOutputData | null>(null);
    const [selectedBeamIndex, setSelectedBeamIndex] = useState(0);

    const handleChangeSolution = (index: any, solution: BeamSolution) => {
        setSelectedSolution(solution);
        setSelectedSolutionIndex(index);
    }
    const handleSelectBeam = (index: any, beam: BeamOutputData) => {
        setSelectedBeam(beam);
        onSelect(beam);
        setSelectedBeamIndex(index);
    }

    useEffect(() => {
        // Set initial values when the component mounts
        setSelectedSolutionIndex(0);
        setSelectedBeamIndex(0);
        if (beamList && beamList.length > 0 && beamList[0].outputDataList && beamList[0].outputDataList.length > 0) {
            onSelect(beamList[0].outputDataList[0]);
            setSelectedSolution(beamList[0]);
            setSelectedBarQueue(beamList[0].barQueue);
            setSpanBars(getSpanBars(beamList[0].barQueue));
            setMaxColumns(getNumberColumns(beamList[0].barQueue));
        }
    }, [beamList]);

    const getSubBars = (barQueue: BarQueue, index: number) => {
        const arr = barQueue ? barQueue.usingSpanBars.filter(bar => bar.index == index).sort((b1, b2) => b1.subIndex - b2.subIndex) : [];
        return arr;
    }

    const getSpanBars = (barQueue: BarQueue) => {
        const arrays: SpanBar[][] = barQueue ? Array.from({ length: barQueue?.currentParentIndex - 1 }, (_, index) => getSubBars(barQueue, index + 1)) : [];
        return arrays;
    }

    const getRemainBar = (index: number): SpanBar | null => {
        const bars = selectedBarQueue ? selectedBarQueue.remainingSpanBars.filter(bar => bar.index == index) : [];
        return bars && bars.length > 0 ? bars[0] : null;
    }
    const getNumberColumns = (barQueue: BarQueue) => {
        const arrays: SpanBar[][] = barQueue ? Array.from({ length: barQueue?.currentParentIndex - 1 }, (_, index) => getSubBars(barQueue, index + 1)) : [];
        const maxLength = arrays ? Math.max(...arrays.map(arr => arr.length)) : 0;
        return maxLength;
    }

    const handleSpanClick = (label: string) => {
        onClickSpan(label);
    }

    useEffect(() => {
        // Fire onSelect with the first beam from selectedSolution?.outputDataList when the component initializes
        if (selectedSolution && selectedSolution.outputDataList.length > 0) {
            onSelect(selectedSolution.outputDataList[0]);
        }
    }, [selectedSolution]);
    return (
        <>
            <div>
                <nav className='solutionNav'>
                    <ul>
                        {beamList.map((solution, index) => (
                            <li key={index}>
                                <button key={index} className={`solutionBtn ${selectedSolutionIndex === index ? 'selected' : ''}`} onClick={() => { handleChangeSolution(index, solution) }}>
                                    {index + 1}
                                    <span className='solutionSpan'></span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="container_result_table">
                <div className="table_c_b">
                    <table className="table1">
                        <tbody>
                            {selectedSolution?.outputDataList.map((beam, index) => (
                                <tr className={`SubbarRow_beam ${selectedBeamIndex === index ? 'selected' : ''}`} key={index}>
                                    <td className='columnSubbar_beam'>
                                        <a href='#' className='spanIndexValue' onClick={() => handleSelectBeam(index, beam)}>{beam?.name}</a>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
                <div className="table_c">
                    <table className="table1">
                        <thead>
                            <tr className="fixed-row">
                                <th className="columnRemainbar">{`BARS[${selectedBarQueue ? selectedBarQueue?.currentParentIndex - 1 : 0}] (${selectedSolution?.unit})`}</th>
                                {Array.from({ length: maxColumns }, (_, index) => (
                                    <th className='columnSubbar' key={index}></th>
                                ))}
                                <th className="columnRemainbar">REMAIN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedBarQueue && Array.from({ length: selectedBarQueue?.currentParentIndex - 1 }, (_, index) => (

                                <tr className='SubbarRow' key={index}>
                                    <td className='columnSubbar'>
                                        <span className='remain_label'>{`L${index + 1}`}</span>
                                    </td>
                                    {spanBars && spanBars[index].map((bar, idx) => (
                                        <td key={idx} className='columnSubbar'>
                                            <a href='#' className='spanIndexValue' onClick={() => { handleSpanClick(`L${index + 1}-${bar.subIndex}`) }}> {`L${index + 1}-${bar.subIndex}`}</a>
                                            <span className='spanValue'>({bar.length})</span>
                                        </td>
                                    ))}

                                    {Array.from({ length: maxColumns - (spanBars ? spanBars[index]?.length : 0) }, (_, index) => (
                                        <td key={index} className='columnRemainbar'></td>
                                    ))}
                                    {getRemainBar(index + 1) &&
                                        (<td className='columnRemainbar'>
                                            {`L${index + 1}-${getRemainBar(index + 1)?.subIndex} (${getRemainBar(index + 1)?.length})`}
                                        </td>)
                                    }
                                    {!getRemainBar(index + 1) &&
                                        (<td className='columnRemainbar'></td>)
                                    }
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default BeamTableForm;
