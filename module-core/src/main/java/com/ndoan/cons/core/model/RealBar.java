package com.ndoan.cons.core.model;

/**
 represent the cut bar from standard bar

 **/
public class RealBar {
    int parentIndex;
    int index;
    int length;

    public static RealBar newBar(int length) {
        RealBar bar = new RealBar();
        bar.length = length;
        bar.parentIndex = -1;

        return bar;
    }

    public RealBar clone() {
        RealBar bar = new RealBar();
        bar.parentIndex = parentIndex;
        bar.index = index;
        bar.length =length;
        return  bar;
    }

    @Override
    public String toString() {
        return  " bar[pidx:" + parentIndex + ",idx:" + index + ",length:" + length + "]";
    }
}
