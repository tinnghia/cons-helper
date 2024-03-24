package com.ndoan.cons.core.model;

import com.ndoan.cons.core.dto.OutputSet;
import com.ndoan.cons.core.dto.OutputSplit;
import com.ndoan.cons.core.dto.SplitMethod;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SpanBarQueue {
    int currentParentIndex;
    Map<Integer, SpanBar> usingSpanBars;

    Map<Integer, SpanBar> remainingSpanBars;

    public SpanBarQueue() {
        currentParentIndex = 1;
        usingSpanBars = new HashMap<>();
        remainingSpanBars = new HashMap<>();
    }

    public void add(OutputSet outputSet) {
        List<OutputSplit> splits = outputSet.getSplit();
        for (int i = 1; i <= outputSet.getTotal(); i++) {
            for (OutputSplit split : splits) {
                if(split.getTotal()> 0 ) {
                    if (usingSpanBars.containsKey(split.getLength())) {
                        usingSpanBars.get(split.getLength()).addParent(currentParentIndex, split.getTotal());
                    } else {
                        usingSpanBars.put(split.getLength(), new SpanBar(currentParentIndex, split.getTotal()));
                    }
                }
            }
            if (remainingSpanBars.containsKey(outputSet.getRemain_per_each())) {
                remainingSpanBars.get(outputSet.getRemain_per_each()).addParent(currentParentIndex, 1);
            } else {
                remainingSpanBars.put(outputSet.getRemain_per_each(), new SpanBar(currentParentIndex, 1));
            }
            currentParentIndex++;
        }
    }

    public void add(SplitMethod method) {
        for (OutputSet set : method.getSet()) {
            add(set);
        }
    }

    public int  findAndRemove(int expectedLength) {

        if (usingSpanBars.containsKey(expectedLength) && usingSpanBars.get(expectedLength).checkAvailable()) {
            return  usingSpanBars.get(expectedLength).use();
        }

        return -1;
    }
}
