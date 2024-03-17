package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.model.BeamInputData;
import com.ndoan.cons.core.model.SolutionMainBar;

import java.util.List;

public interface MainBarFinder {
    List<SolutionMainBar> find(BeamInputData inputData);
}
