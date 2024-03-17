package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.model.BeamInputData;
import com.ndoan.cons.core.model.SafeLapPoint;

import java.util.List;

public interface SafeLapPointFinder {

    List<SafeLapPoint> findSafeLapPointsForTop(BeamInputData inputData);
    List<SafeLapPoint> findSafeLapPointsForBottom(BeamInputData inputData);
}
