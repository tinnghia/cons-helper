package com.ndoan.cons.core.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BeamListOutputData {
    private String workId;
    String unit;
    List<BeamOutputData> outputDataList;
    SpanBarQueue barQueue;
}
