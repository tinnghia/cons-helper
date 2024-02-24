package com.ndoan.cons.core.dto;

import java.util.List;

public class OutputData {
    private int min_bars;
    private List<OutputSet> set;

    // Getters and setters
    public int getMin_bars() {
        return min_bars;
    }

    public void setMin_bars(int min_bars) {
        this.min_bars = min_bars;
    }

    public List<OutputSet> getSet() {
        return set;
    }

    public void setSet(List<OutputSet> set) {
        this.set = set;
    }
}