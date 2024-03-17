package com.ndoan.cons.core.model;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class Range {
    int begin;
    int end;
    int anchor;

    public Range() {

    }
    public Range(int begin, int end, int anchor) {
        this.begin = begin;
        this.end = end;
        this.anchor = anchor;
    }

    @Override
    public String toString() {
        return "[" + begin + "-" + end + "/" + anchor + "]";
    }
}