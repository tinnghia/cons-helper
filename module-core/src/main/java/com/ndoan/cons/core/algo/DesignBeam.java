package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.model.BeamInputData;
import com.ndoan.cons.core.model.BeamOutputData;
import com.ndoan.cons.core.model.SolutionMainBar;

import java.util.ArrayList;
import java.util.List;

public class DesignBeam {

    static SafeLapPointFinderImpl safeLapPointFinder = new SafeLapPointFinderImpl();
    static RealBarArranger realBarArranger = new RealBarArrangerWithIncreasingDelta();

    static TopMainBarFinder topMainBarFinder = new TopMainBarFinder(safeLapPointFinder, realBarArranger);
    static BottomMainBarFinder bottomMainBarFinder = new BottomMainBarFinder(safeLapPointFinder, realBarArranger);

    static BeamInputProcessor beamInputProcessor = new BeamInputProcessorImpl();

    public BeamOutputData designBeam(BeamInputData inputData) {
        BeamOutputData outputData = new BeamOutputData();
        return outputData;
    }

    public static void main(String[] args) {
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

        inputData = beamInputProcessor.processInput(inputData);
        List<SolutionMainBar> topBars = topMainBarFinder.find(inputData);
        List<SolutionMainBar> bottomBars = bottomMainBarFinder.find(inputData);


        List<SolutionMainBar> pickedTopBars = new ArrayList<>();
        List<SolutionMainBar> pickedBottomBars = new ArrayList<>();

        for (int i = 0; i < 10; i++) pickedTopBars.add(topBars.get(i));
        for (int i = 0; i < 10; i++) pickedBottomBars.add(bottomBars.get(i));
        List<SolutionMainBar> allPicked = new ArrayList<>();
        allPicked.addAll(pickedTopBars);
        allPicked.addAll(pickedBottomBars);
        boolean checkTop = DesignBeamHelpers.checkMainBarsMeet50PercentCondition(pickedTopBars);
        boolean checkBottom = DesignBeamHelpers.checkMainBarsMeet50PercentCondition(pickedBottomBars);
        boolean checkAllMeet = DesignBeamHelpers.checkMainBarsMeet50PercentCondition(allPicked);

        System.out.println("checkTop = " + checkTop + ", checkBottom" + checkBottom + ", checkAllMeet" + checkAllMeet);

    }

}

