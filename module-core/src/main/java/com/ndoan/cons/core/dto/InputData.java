package com.ndoan.cons.core.dto;

import java.util.List;

public class InputData {
    private String unit;
    private int bar_length;
    private List<SubsData> subs;

    // Getters and setters
    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public double getBar_length() {
        return bar_length;
    }

    public void setBar_length(int bar_length) {
        this.bar_length = bar_length;
    }

    public List<SubsData> getSubs() {
        return subs;
    }

    public void setSubs(List<SubsData> subs) {
        this.subs = subs;
    }

}
