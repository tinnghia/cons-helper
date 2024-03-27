package com.ndoan.cons.core.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MultiBeamListOutputData {
    private String workId;
    List<BeamListOutputData> beamList;
}
