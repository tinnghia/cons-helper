package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.model.*;

import java.util.ArrayList;
import java.util.List;

/**
 * This algorithm will get all cases, but won't meet 50 percent rule
 *
 */
public class RealBarArrangerWithRecursive implements RealBarArranger {
    @Override
    public List<SolutionMainBar> arrange(TopMainBar rangeBar, BeamInputData inputData) {
        System.out.println("     ==> arrange bar with steps for bar " + this);
        List<SolutionMainBar> resultList = new ArrayList<>();
        SolutionMainBar currentSolution = new SolutionMainBar();
        arrangeBarWithOnlyOverlapAndStartFromLeftAt(rangeBar.getBars(), inputData, resultList, currentSolution, 0, 0);

        return resultList;
    }

    private void arrangeBarWithOnlyOverlapAndStartFromLeftAt(List<SpliceRangeBar> bars, BeamInputData inputData, List<SolutionMainBar> resultList,
                                                            SolutionMainBar currentSolution, int currentBarIdx, int currentX) {
        if (currentBarIdx >= bars.size()) {
            System.out.println("     ==> FOUND SOLUTION: " + currentSolution);
            resultList.add(currentSolution);
            return;
        }
        SpliceRangeBar bar = bars.get(currentBarIdx);
        Range common = currentBarIdx == bars.size() - 1 ? bar.getEnd() : DesignBeamHelpers.findCommonRange(bar.getEnd(), bars.get(currentBarIdx + 1).getBegin());

        int delta = 0;
        while (common.getBegin() + delta <= common.getEnd()) {
            int neededLength = bar.getBegin().getAnchor() + common.getBegin() + delta - currentX;
            System.out.println("Bar " + currentBarIdx + " from [" + currentX + " -> " + (common.getBegin() + delta) + "] need " + neededLength);

            if (neededLength > inputData.getStandardBarLength()) {
                System.out.println("Over standard bar --> ignored");
                break;
            }
            if (currentBarIdx == 2) {
                System.out.println();
            }
            SolutionMainBar newSolution = currentSolution.clone();
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
            int newCurrentX = common.getBegin() + delta - inputData.getOverLapLength();
            arrangeBarWithOnlyOverlapAndStartFromLeftAt(bars, inputData, resultList, newSolution, currentBarIdx + 1, newCurrentX);
            //break;
            delta += inputData.getStepsBetweenOverlapSolutions();
        }

    }
}
