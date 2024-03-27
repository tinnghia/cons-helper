package com.ndoan.cons.core.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SpanBar {
    int length;
    int index;
    int subIndex;
    boolean used;

    public SpanBar(int length, int index, int subIndex) {
        this.length = length;
        this.index = index;
        this.subIndex = subIndex;
    }

    public void use() {
        this.used = true;
    }

    public SpanBar clone() {
        SpanBar cloned = new SpanBar(this.length, this.index, this.subIndex);
        cloned.used = this.used;
        return cloned;
    }
}
