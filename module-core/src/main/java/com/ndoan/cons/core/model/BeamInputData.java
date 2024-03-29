package com.ndoan.cons.core.model;

import lombok.Data;

@Data
public class BeamInputData {
    int id;
    String name;
    int standardBarLength;
    int mainBarDiameter;
    int rifBarDiameter;
    int labLength; //30,40d
    int anchorLength; //15d
    int topMainBars;
    int bottomMainBars;
    double topSafeZoneAwayFromColumn;
    double bottomSafeZoneFromColumn;
    int firstColumnIndex;
    int lastColumnIndex;
    int[] spans;
    Rebar[] rebars;

    /** generated values during calculation **/
    int eachAnchorLength;
    int totalLengh;
    int minStandardBars;
    int overLapLength;
    boolean needBeginAnchor;
    boolean needEndAnchor;
    int stepsBetweenOverlapSolutions = 10;
}
