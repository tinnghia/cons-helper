package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.model.*;

import java.util.ArrayList;
import java.util.List;

public class BottomMainBarFinder implements MainBarFinder {

    SafeLapPointFinder safeLapPointFinder;
    RealBarArranger realBarArranger;

    public BottomMainBarFinder(SafeLapPointFinder safeLapPointFinder, RealBarArranger realBarArranger) {
        this.safeLapPointFinder = safeLapPointFinder;
        this.realBarArranger = realBarArranger;
    }

    @Override
    public List<SolutionMainBar> find(BeamInputData inputData) {
        List<TopMainBar> resultList = new ArrayList<>();
        List<SafeLapPoint> safePoints = safeLapPointFinder.findSafeLapPointsForBottom(inputData);
        TopMainBar currentBar = new TopMainBar();
        Range beginRange = new Range(0, 0, 0);
        if (inputData.isNeedBeginAnchor()) {
            beginRange.setAnchor(inputData.getEachAnchorLength());
        }

        findApplicableBottomMainBars(inputData, safePoints, resultList, currentBar, 0, beginRange);


        inputData.setStepsBetweenOverlapSolutions(inputData.getOverLapLength() + 5); // use overlap length

        List<SolutionMainBar> solutionMainBarList = new ArrayList<>();
        for (int i = 0; i < resultList.size(); i++) {
            System.out.println("------------------");
            System.out.println("------------------");
            System.out.println("Now arrange :" + resultList.get(i));
            System.out.println("------------------");
            //resultList.get(i).arrangeBarWithOnlyOverlapAndStartFromLeft(inputData);
            //if(i!=1)
            //solutionMainBarList.addAll(resultList.get(i).arrangeBarWithOnlyOverlapWithStepsAtDelta(inputData));
            solutionMainBarList.addAll(realBarArranger.arrange(resultList.get(i), inputData));
        }

        System.out.println("TOTAL OF ALL POSSIBLE BOTTOM SOLUTION IS:" + solutionMainBarList.size());
        solutionMainBarList.sort((smb1, smb2) -> smb1.getBarQueue().getTotalStandardBars() - smb2.getBarQueue().getTotalStandardBars());

        List<SolutionMainBar> optimalList = new ArrayList<>();
        for (int i = 0; i < solutionMainBarList.size(); i++) {
            System.out.println("Total Standard bars:" + solutionMainBarList.get(i).getBarQueue().getTotalStandardBars());
            if (i < 10)
                optimalList.add(solutionMainBarList.get(i));
        }

        boolean checkMeet = DesignBeamHelpers.checkMainBarsMeet50PercentCondition(optimalList);
        System.out.println("ALL LIST are " + optimalList.size() + " - " + checkMeet);

        return solutionMainBarList;
    }


    private void findApplicableBottomMainBars(BeamInputData inputData, List<SafeLapPoint> safePoints, List<TopMainBar> resultList,
                                              TopMainBar currentBar,
                                              int currentSafePointIdx, Range beginRange) {

        if (beginRange.getBegin() > beginRange.getEnd()) {
            //the current safePoint doesn't have enough space for overlap
            //System.out.println("ignored - current beginRange not enough");
            return;
        }

        if (currentBar.getBars().size() > 0 && !currentBar.getBars().get(currentBar.getBars().size() - 1).isOk(inputData.getStandardBarLength())) {
            //System.out.println(currentBar.getBars().get(currentBar.getBars().size()-1) + " ignored - Bar can't be arranged");
            return;
        }
        if (currentSafePointIdx >= safePoints.size()) {
            //reach the end

            Range endRange = new Range();
            endRange.setEnd(inputData.getTotalLengh());
            endRange.setBegin(inputData.getTotalLengh());
            if (inputData.isNeedEndAnchor()) {
                endRange.setAnchor(inputData.getAnchorLength());
            }
            SpliceRangeBar spliceBar = new SpliceRangeBar();
            spliceBar.setBegin(beginRange);
            spliceBar.setEnd(endRange);

            if (!spliceBar.isOk(inputData.getStandardBarLength())) {
                //System.out.println("reach end, but not ok --> ignored");
                return;
            }
            TopMainBar bar = TopMainBar.clone(currentBar);
            bar.getBars().add(spliceBar);

            bar.updateRangeWithStandardBar(inputData);
            System.out.println("found bottom bar: ");
            System.out.println("             " + bar);
            resultList.add(bar);
            return;
        }

        //have overlap on current safePointIdx

        Range endRange = new Range();
        endRange.setEnd(safePoints.get(currentSafePointIdx).getEnd());
        endRange.setBegin(safePoints.get(currentSafePointIdx).getBegin() + inputData.getOverLapLength());
        SpliceRangeBar spliceBar = new SpliceRangeBar();
        spliceBar.setBegin(beginRange);
        spliceBar.setEnd(endRange);

        Range newBeginRange = new Range();
        newBeginRange.setEnd(safePoints.get(currentSafePointIdx).getEnd() - inputData.getOverLapLength());
        newBeginRange.setBegin(safePoints.get(currentSafePointIdx).getBegin());

        currentBar.getBars().add(spliceBar);
        findApplicableBottomMainBars(inputData, safePoints, resultList, currentBar, currentSafePointIdx + 1, newBeginRange);

        currentBar.getBars().remove(currentBar.getBars().size() - 1);
        //dont have overlap on current safePointIdx
        findApplicableBottomMainBars(inputData, safePoints, resultList, currentBar, currentSafePointIdx + 1, beginRange);
    }

}
