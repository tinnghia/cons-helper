package com.ndoan.cons.core.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * Represent main bar in range
 */
@Data
public class MainRangeBar {
    /* 20 cm - treat the bar leftover if the length <= MAX_USELESS_BAR */
    public static int MAX_USELESS_BAR = 20 * 10;

    List<SpliceRangeBar> bars = new ArrayList<>();
}
