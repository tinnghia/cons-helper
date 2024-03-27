package com.ndoan.cons.core.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BeamOutputData {
    int id;
    String name;
    List<SolutionMainBar> topBars;
    List<SolutionMainBar> bottomBars;
    int[] spans;
    int[] indexes;
}
