package com.ndoan.cons.core.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SafeLapPoint {
    int spanIndex;
    int begin;
    int end;

    int getDistance() {
        return end - begin;
    }
}
