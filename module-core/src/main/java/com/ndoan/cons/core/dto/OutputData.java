package com.ndoan.cons.core.dto;

import java.util.List;

public class OutputData {

    private String workId;
    private String unit;
    private double bar_length;

    private int min_bars;
    private List<SplitMethod> methods;

    private String displayDividedBars;

    public String getDisplayDividedBars() {
        return displayDividedBars;
    }

    public void setDisplayDividedBars(String displayDividedBars) {
        this.displayDividedBars = displayDividedBars;
    }

    public String getWorkId() {
        return workId;
    }

    public void setWorkId(String workId) {
        this.workId = workId;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public double getBar_length() {
        return bar_length;
    }

    public void setBar_length(double bar_length) {
        this.bar_length = bar_length;
    }

    // Getters and setters
    public int getMin_bars() {
        return min_bars;
    }

    public void setMin_bars(int min_bars) {
        this.min_bars = min_bars;
    }

    public List<SplitMethod> getMethods() {
        return methods;
    }

    public void setMethods(List<SplitMethod> methods) {
        this.methods = methods;
    }
}