package com.ndoan.cons.core.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BeamListOutputData {
    private String workId;
    List<BeamOutputData> outputDataList;
    SpanBarQueue barQueue;
}
