package com.ndoan.cons.core.dto;

import java.util.List;

public class OutputSet {
    private int total;
    private List<OutputSplit> split;
    private int remain_per_each;
    private String displaySplit;

    // Getters and setters
    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public String getDisplaySplit() {
        return displaySplit;
    }

    public void setDisplaySplit(String displaySplit) {
        this.displaySplit = displaySplit;
    }

    public List<OutputSplit> getSplit() {
        return split;
    }

    public void setSplit(List<OutputSplit> split) {
        this.split = split;
    }

    public int getRemain_per_each() {
        return remain_per_each;
    }

    public void setRemain_per_each(int remain_per_each) {
        this.remain_per_each = remain_per_each;
    }
}
