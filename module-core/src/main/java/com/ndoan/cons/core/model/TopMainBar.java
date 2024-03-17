package com.ndoan.cons.core.model;

import lombok.Getter;

import java.util.List;

public class TopMainBar extends MainRangeBar {

    /**
     * all real possible solutions according to a range solution
     **/

    @Getter
    List<SolutionMainBar> solutions;

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < bars.size(); i++) {
            builder.append(bars.get(i) + " <|> ");
        }
        return builder.toString();
    }

    public static TopMainBar clone(TopMainBar topMainBar) {
        TopMainBar mainBar = new TopMainBar();
        for (int i = 0; i < topMainBar.getBars().size(); i++) {
            mainBar.getBars().add(SpliceRangeBar.clone(topMainBar.getBars().get(i)));
        }
        return mainBar;
    }

    public void updateRangeWithStandardBar(BeamInputData inputData) {
        //update range for each bar, according to the maximum length can be arranged by a standard bar
        for (int i = 0; i <= bars.size() - 1; i++) {
            SpliceRangeBar bar = bars.get(i);
            //the end of end is probably wrong, so just update it
            if (bar.end.end + bar.begin.anchor - bar.begin.end > inputData.standardBarLength) {
                System.out.println("correcting range of bar : " + i + " :" + bar);
                bar.end.end = bar.begin.end + inputData.standardBarLength - bar.begin.anchor;
                System.out.println("corrected range of bar : " + bar);
            }
        }
    }

}
