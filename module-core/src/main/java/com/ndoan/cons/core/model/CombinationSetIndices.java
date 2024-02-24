package com.ndoan.cons.core.model;

import lombok.Data;
import org.apache.logging.log4j.util.Strings;

import java.util.Arrays;

@Data
public class CombinationSetIndices {
    int [] indices;
    int total;

    @Override
    public String toString() {
        return Strings.join(Arrays.stream(indices).iterator(), ',');
    }
}
