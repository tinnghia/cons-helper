import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import BeamViewerCanvas from './BeamViewerCanvas';
import "./DesignBeamViewerForm.css";

interface ViewerFormProps {
    findex: string,
    lindex: string,
    indexes?: []
}

const DesignBeamViewerForm = forwardRef<any, ViewerFormProps>(({ indexes, findex, lindex }, ref) => {

    const [topBars, setTopBars] = useState<any>([]);
    const [spans, setSpans] = useState<any>([]);
    const beamCanvasRef = useRef<any>(null);
    const initializeTopBars = () => {
        console.log(findex,lindex)
        const newSpans = indexes ? indexes?.map((_, index) => {
            const numbers = indexes.slice(0, index + 1).map(Number);
            const sum = numbers.reduce((acc, curr) => acc + curr, 0);
            return sum;
        }) : [];
        const bValue = (findex === 'first' ? newSpans[0] : 0);
        const eValue = (lindex === 'last' ? newSpans[newSpans.length - 1] : newSpans[newSpans.length - 2]);
        const newTopBars = newSpans.length > 0 ? [{ bars: [{ beginValue: bValue, endValue: eValue }] }] : [];

        console.log('newSpans', newSpans, newTopBars)
        setSpans(newSpans);
        setTopBars(newTopBars);
    };
    const hanlleSpanAction = (action: string, span: any, updateIndexes: []) => {
        const sum = updateIndexes?.map(Number).reduce((acc, curr) => acc + curr, 0);
        console.log('hanlleSpanAction-updateIndexes', updateIndexes, sum)
        if (beamCanvasRef.current) {
            beamCanvasRef.current.handleZoomTo(action, span, sum);
        }
    };

    useEffect(() => {
        initializeTopBars();

    }, [findex, lindex]);

    useEffect(() => {
        initializeTopBars();
    }, [indexes]);

    useImperativeHandle(ref, () => ({
        hanlleSpanAction: hanlleSpanAction
    }));

    return (
        <BeamViewerCanvas topBars={topBars} bottomBars={[]} indexes={spans} ref={beamCanvasRef} ></BeamViewerCanvas>
    )
});

export default DesignBeamViewerForm;
