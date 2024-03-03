package com.ndoan.cons.core.model;

import lombok.Data;
import org.apache.logging.log4j.util.Strings;

import java.util.Arrays;


@Data
public class CombinationSet {
    int[] lengths;
    int[] totals;

    int sum;

    @Override
    public String toString() {
        String str = Strings.join(Arrays.stream(totals).iterator(), ',');
        str = str + "=" + sum;
        return str;
    }
}
