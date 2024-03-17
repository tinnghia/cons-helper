package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.model.BeamInputData;

import java.util.Arrays;

public class BeamInputProcessorImpl implements BeamInputProcessor {
    @Override
    public BeamInputData processInput(BeamInputData inputData) {
        int eachAnchorLength = inputData.getAnchorLength() * inputData.getMainBarDiameter();
        System.out.println("anchor Length : " + eachAnchorLength);
        inputData.setEachAnchorLength(eachAnchorLength);
        int totalLengh = Arrays.stream(inputData.getSpans()).reduce(0, Integer::sum);
        System.out.println("Total needed:" + totalLengh);
        inputData.setTotalLengh(totalLengh);

        int roundedResult = (int) Math.ceil((double) totalLengh / inputData.getStandardBarLength());

        System.out.println("Best number of standard bars:" + roundedResult); // minimum is 3 standard bars
        inputData.setMinStandardBars(roundedResult);

        // optimal cutting is having minimum overlaps
        //each overlaps will be added an extra:
        int extraEachOverlap = inputData.getLabLength() * inputData.getMainBarDiameter();


        System.out.println("extraEachOverlap : " + extraEachOverlap);
        inputData.setOverLapLength(extraEachOverlap);

        inputData.setNeedBeginAnchor(inputData.getFirstColumnIndex() == 0);
        inputData.setNeedEndAnchor(inputData.getLastColumnIndex() == inputData.getSpans().length - 1);
        return inputData;
    }
}
