package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.model.BeamInputData;
import com.ndoan.cons.core.model.SolutionMainBar;
import com.ndoan.cons.core.model.TopMainBar;

import java.util.List;

public interface RealBarArranger {
    List<SolutionMainBar> arrange(TopMainBar rangeBar, BeamInputData inputData);
}
