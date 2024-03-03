package com.ndoan.cons.core.model;

import java.util.List;

public class CombinationResult {
    private List<CombinationSet> combinationSets;
    private List<CombinationSetIndices> resultIndices;

    public List<CombinationSet> getCombinationSets() {
        return combinationSets;
    }

    public void setCombinationSets(List<CombinationSet> combinationSets) {
        this.combinationSets = combinationSets;
    }

    public List<CombinationSetIndices> getResultIndices() {
        return resultIndices;
    }

    public void setResultIndices(List<CombinationSetIndices> resultIndices) {
        this.resultIndices = resultIndices;
    }
}
