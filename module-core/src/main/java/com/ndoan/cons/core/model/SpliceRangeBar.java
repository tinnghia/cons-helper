package com.ndoan.cons.core.model;


import lombok.Getter;
import lombok.Setter;

public class SpliceRangeBar {
    @Getter
    @Setter
    Range begin;
    @Getter
    @Setter
    Range end;
    public static SpliceRangeBar clone(SpliceRangeBar spliceBar) {
        SpliceRangeBar spb = new SpliceRangeBar();
        spb.setBegin(new Range(spliceBar.begin.getBegin(), spliceBar.begin.getEnd(), spliceBar.begin.getAnchor()));
        spb.setEnd(new Range(spliceBar.end.getBegin(), spliceBar.end.getEnd(), spliceBar.end.getAnchor()));

        return spb;
    }

    public boolean isOk(int distance) {
        return distance>(begin.anchor + end.begin  - begin.end );
    }

    @Override
    public String toString() {
        return "[" + begin + "<--->" + end + "]";
    }

}
