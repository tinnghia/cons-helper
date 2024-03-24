package com.ndoan.cons.core.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolutionSpliceBar {
    /**
     * begin of bar as a solution
     **/
    int beginValue;
    /**
     * end of bar as a solution
     */
    int endValue;

    int beginAnchor;
    int endAnchor;

    int parentIndex;
    /**
     * refer to cut bar
     */
    RealBar referredBar;

    public SolutionSpliceBar clone() {
        SolutionSpliceBar ssb = new SolutionSpliceBar();
        ssb.beginValue = beginValue;
        ssb.endValue = endValue;
        ssb.beginAnchor = beginAnchor;
        ssb.endAnchor = endAnchor;
        ssb.parentIndex = parentIndex;
        if (referredBar == null) {
            ssb.referredBar = referredBar.clone();
        }
        ssb.referredBar = referredBar.clone();
        return ssb;
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append(" " + beginAnchor).append("[").append(beginValue).append("-").append(endValue).append("]/").append(endAnchor + " ");
        return builder.toString();
    }
}
