package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.model.BeamInputData;
import com.ndoan.cons.core.model.BeamOutputData;
import com.ndoan.cons.core.model.SolutionMainBar;

import java.util.ArrayList;
import java.util.List;

public class DesignBeam {

    SafeLapPointFinderImpl safeLapPointFinder;
    RealBarArranger realBarArranger;

    TopMainBarFinder topMainBarFinder;
    BottomMainBarFinder bottomMainBarFinder;

    BeamInputProcessor beamInputProcessor;

    public DesignBeam() {
        safeLapPointFinder = new SafeLapPointFinderImpl();
        realBarArranger = new RealBarArrangerWithIncreasingDelta();

        topMainBarFinder = new TopMainBarFinder(safeLapPointFinder, realBarArranger);
        bottomMainBarFinder = new BottomMainBarFinder(safeLapPointFinder, realBarArranger);

        beamInputProcessor = new BeamInputProcessorImpl();
    }

    public BeamOutputData design(BeamInputData inputData) {
        BeamOutputData outputData = new BeamOutputData();
        inputData = beamInputProcessor.processInput(inputData);

        List<SolutionMainBar> topBars = topMainBarFinder.find(inputData);
        List<SolutionMainBar> bottomBars = bottomMainBarFinder.find(inputData);

        List<SolutionMainBar> pickedTopBars = new ArrayList<>();
        List<SolutionMainBar> pickedBottomBars = new ArrayList<>();

        for (int i = 0; i < inputData.getTopMainBars(); i++) pickedTopBars.add(topBars.get(i));
        for (int i = 0; i < inputData.getBottomMainBars(); i++) pickedBottomBars.add(bottomBars.get(i));

        List<SolutionMainBar> allPicked = new ArrayList<>();
        allPicked.addAll(pickedTopBars);
        allPicked.addAll(pickedBottomBars);
        boolean checkTop = DesignBeamHelpers.checkMainBarsMeet50PercentCondition(pickedTopBars);
        boolean checkBottom = DesignBeamHelpers.checkMainBarsMeet50PercentCondition(pickedBottomBars);
        boolean checkAllMeet = DesignBeamHelpers.checkMainBarsMeet50PercentCondition(allPicked);

        System.out.println("checkTop = " + checkTop + ", checkBottom" + checkBottom + ", checkAllMeet" + checkAllMeet);

        outputData.setTopBars(pickedTopBars);
        outputData.setBottomBars(pickedBottomBars);


        inputData.setNeedBeginAnchor(inputData.getFirstColumnIndex() == 0);
        inputData.setNeedEndAnchor(inputData.getLastColumnIndex() == inputData.getSpans().length - 1);

        List<Integer> indexes = new ArrayList<>();
        if (inputData.getFirstColumnIndex() == 0) {
            indexes.add(0);
        }
        int currentLength = 0;
        for (int i = 0; i < inputData.getSpans().length - 1; i++) {
            currentLength = currentLength + inputData.getSpans()[i];
            indexes.add(currentLength);
        }
        if (inputData.getLastColumnIndex() == inputData.getSpans().length - 1) {
            indexes.add(currentLength + inputData.getSpans()[inputData.getSpans().length - 1]);
        }

        outputData.setIndexes(indexes.stream().mapToInt(i -> i).toArray());
        return outputData;
    }

    public static void main(String[] args) {
        DesignBeam designBeam = new DesignBeam();
        BeamInputData inputData = new BeamInputData();

        inputData.setStandardBarLength(11700); //mm
        inputData.setAnchorLength(15);
        inputData.setSpans(new int[]{5000, 3000, 12000, 8000, 2000});
        inputData.setFirstColumnIndex(0);
        inputData.setLastColumnIndex(inputData.getSpans().length - 2);  // last -1
        inputData.setLabLength(30);
        inputData.setAnchorLength(15);
        inputData.setMainBarDiameter(22); //d22 = 22mm
        inputData.setTopSafeZoneAwayFromColumn(0.25);
        inputData.setBottomSafeZoneFromColumn(0.25);

        designBeam.design(inputData);


    }

}

