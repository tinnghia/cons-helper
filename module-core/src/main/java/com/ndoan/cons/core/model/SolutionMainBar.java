package com.ndoan.cons.core.model;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class SolutionMainBar {
    List<SolutionSpliceBar> bars;
    BarQueue barQueue;

    public SolutionMainBar() {
        bars = new ArrayList<>();
        barQueue = new BarQueue();
    }
    public SolutionMainBar clone() {
        SolutionMainBar smb = new SolutionMainBar();
        for(int i = 0;i<bars.size();i++) {
            smb.bars.add(bars.get(i).clone());
        }
        smb.barQueue = barQueue.clone();
        return smb;
    }

    public boolean checkHasPostionAtOverlap(int x) {
        for(int i = 0;i< bars.size()-1;i++) {
            if(bars.get(i+1).beginValue<=x && bars.get(i).endValue>=x) {
                return true;
            }
        }
        return false;
    }

    List<Range> ranges;
    public List<Range> getRanges() {
        if(ranges != null) {
            return ranges;
        }else {
            ranges = new ArrayList<>();
        }
        for(int i = 0;i<bars.size()-1;i++) {
            ranges.add(new Range(bars.get(i+1).beginValue, bars.get(i).endValue, 0 ));
        }
        return ranges;
    }
    public String getReferredBar(RealBar bar) {
        //barQueue
        RealBar root = barQueue.findRootBar(bar);
        return " bar[" + root.index + "] ";
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        for(int i=0;i<bars.size();i++)
            builder.append(bars.get(i));

        builder.append("\n        details: ");
        builder.append(barQueue);
        builder.append("\narranged bars\n");
        for(int i=0;i<bars.size();i++) {
            builder.append(getReferredBar(bars.get(i).referredBar));
        }
        return builder.toString();
    }
}
