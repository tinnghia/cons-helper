package com.ndoan.cons.core.model;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class SpanBar {
    Map<Integer, Integer> usingBarToTotal; //mapping between bar index and number of sub bars
    Map<Integer, Integer> usedBarToTotal; //mapping between bar index and number of sub bars

    public SpanBar() {
        usingBarToTotal = new HashMap<>();
        usedBarToTotal = new HashMap<>();
    }
    public SpanBar(int parentIndex, int number) {
        usingBarToTotal = new HashMap<>();
        usedBarToTotal = new HashMap<>();
        addParent(parentIndex, number);
    }
    public void addParent(int parentIndex, int number) {
        usingBarToTotal.put(parentIndex, number);
        usedBarToTotal.put(parentIndex,0);
    }

    public int use() {
        for(int key : usingBarToTotal.keySet()) {
            if(usingBarToTotal.get(key) > usedBarToTotal.get(key)) {
                usedBarToTotal.put(key, usedBarToTotal.get(key) + 1);
                return key;
            }
        }
        return -1;
    }

    public boolean checkAvailable() {
        for(int key : usingBarToTotal.keySet()) {
            if(usingBarToTotal.get(key) > usedBarToTotal.get(key)) {
                return true;
            }
        }
        return false;
    }
}
