package com.ndoan.cons.core.dto;

import java.util.List;

public class SplitMethod {
    private List<OutputSet> set;

    private String displayRemain;

    public List<OutputSet> getSet() {
        return set;
    }

    public void setSet(List<OutputSet> set) {
        this.set = set;
    }

    public String getDisplayRemain() {
        return displayRemain;
    }

    public void setDisplayRemain(String displayRemain) {
        this.displayRemain = displayRemain;
    }
}
