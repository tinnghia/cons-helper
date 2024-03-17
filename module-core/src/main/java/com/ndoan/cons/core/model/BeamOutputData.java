package com.ndoan.cons.core.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BeamOutputData {
    List<SolutionMainBar> topBars;
    List<SolutionMainBar> bottomBars;
}
