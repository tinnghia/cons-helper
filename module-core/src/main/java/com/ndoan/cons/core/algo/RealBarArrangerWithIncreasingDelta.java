package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.model.*;

import java.util.ArrayList;
import java.util.List;

public class RealBarArrangerWithIncreasingDelta implements RealBarArranger {
    @Override
    public List<SolutionMainBar> arrange(TopMainBar rangeBar, BeamInputData inputData) {
        System.out.println("     ==> arrange bar with steps for bar " + this);
        List<SolutionMainBar> resultList = new ArrayList<>();
        int delta = 0;

        SolutionMainBar bar = arrangeBarWithOnlyOverlapAndStartFromLeftAtDelta(rangeBar.getBars(), inputData, delta);
        while (bar != null) {
            resultList.add(bar);
            delta = delta + inputData.getStepsBetweenOverlapSolutions();
            bar = arrangeBarWithOnlyOverlapAndStartFromLeftAtDelta(rangeBar.getBars(), inputData, delta);
        }

        return resultList;
    }

    private SolutionMainBar arrangeBarWithOnlyOverlapAndStartFromLeftAtDelta(List<SpliceRangeBar> bars, BeamInputData inputData, int delta) {
        int currentX = 0;
        SolutionMainBar newSolution = new SolutionMainBar();
        for (int i = 0; i <= bars.size() - 1; i++) {
            SpliceRangeBar bar = bars.get(i);
            Range common = i == bars.size() - 1 ? bar.getEnd() : DesignBeamHelpers.findCommonRange(bar.getEnd(), bars.get(i + 1).getBegin());
            //get the first point
            int neededLength = bar.getBegin().getAnchor() + common.getBegin() + delta - currentX;

            if (neededLength > inputData.getStandardBarLength()) {
                System.out.println("Over standard bar --> ignored");
                return null;
            }

            System.out.println("Bar " + i + " from [" + currentX + " -> " + common.getBegin() + "] need " + neededLength);
            SolutionSpliceBar solutionSpliceBar = new SolutionSpliceBar();
            solutionSpliceBar.setBeginValue(currentX);
            solutionSpliceBar.setEndValue(common.getBegin() + delta);
            solutionSpliceBar.setBeginAnchor(bar.getBegin().getAnchor());
            newSolution.getBars().add(solutionSpliceBar);

            RealBar takenFromRemain = newSolution.getBarQueue().pop(neededLength);

            if (takenFromRemain == null) {
                //new standard bar needed
                System.out.println("   using 1 standard bar for length:" + neededLength);
                int leftOverBar = inputData.getStandardBarLength() - neededLength;
                System.out.println("   returned 1 leftover bar : " + leftOverBar + " to queue");

                solutionSpliceBar.setReferredBar(newSolution.getBarQueue().pushAndCut(inputData.getStandardBarLength(), neededLength));
            } else {
                System.out.println("   using 1 bar from queue:" + takenFromRemain);
                solutionSpliceBar.setReferredBar(takenFromRemain);
            }
            currentX = common.getBegin() + delta - inputData.getOverLapLength();
        }

        return newSolution;
    }
}
