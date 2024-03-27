package com.ndoan.cons.core.model;

import com.ndoan.cons.core.dto.OutputSet;
import com.ndoan.cons.core.dto.OutputSplit;
import com.ndoan.cons.core.dto.SplitMethod;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Getter
@Setter
public class SpanBarQueue {
    int currentParentIndex;
    List<SpanBar> usingSpanBars;
    List<SpanBar> remainingSpanBars;

    public SpanBarQueue() {
        currentParentIndex = 1;
        usingSpanBars = new ArrayList<>();
        remainingSpanBars = new ArrayList<>();
    }

    public void add(OutputSet outputSet) {
        List<OutputSplit> splits = outputSet.getSplit();
        for (int i = 1; i <= outputSet.getTotal(); i++) {
            int subIndex = 1;
            for (OutputSplit split : splits) {
                for(int k = 0;k<split.getTotal();k++) {
                    SpanBar spanBar = new SpanBar(split.getLength(), currentParentIndex, subIndex);
                    usingSpanBars.add(spanBar);
                    subIndex ++;
                }
            }
            SpanBar spanBar = new SpanBar(outputSet.getRemain_per_each(), currentParentIndex, subIndex);
            remainingSpanBars.add(spanBar);
            currentParentIndex++;
        }
    }

    public void add(SplitMethod method) {
        for (OutputSet set : method.getSet()) {
            add(set);
        }
    }

    public Optional<SpanBar>  findAndRemove(int expectedLength) {
        Optional<SpanBar> bar_ =  usingSpanBars.stream().filter(bar -> bar.length == expectedLength && !bar.used ).findFirst();
        return bar_;
    }
}
