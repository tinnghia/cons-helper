package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.model.BeamInputData;
import com.ndoan.cons.core.model.SafeLapPoint;

import java.util.ArrayList;
import java.util.List;

public class SafeLapPointFinderImpl implements SafeLapPointFinder {
    @Override
    public List<SafeLapPoint> findSafeLapPointsForTop(BeamInputData inputData) {
        List<SafeLapPoint> points = new ArrayList<>();
        int current = 0;
        int numberOfSpans = inputData.getSpans().length;
        int startIndex = inputData.getFirstColumnIndex() == 0 ? 0 : 1;
        int endIndex = inputData.getLastColumnIndex() == numberOfSpans - 1 ? numberOfSpans - 1 : numberOfSpans - 2;
        for (int i = startIndex; i <= endIndex; i++) {
            SafeLapPoint sp = new SafeLapPoint();
            int awayFromColumnLength = (int) Math.ceil(inputData.getTopSafeZoneAwayFromColumn() * inputData.getSpans()[i]);
            sp.setBegin(current + awayFromColumnLength);
            sp.setEnd(current + inputData.getSpans()[i] - awayFromColumnLength);
            points.add(sp);
            sp.setSpanIndex(i);
            current += inputData.getSpans()[i];
        }

        System.out.println(points);
        return points;
    }

    @Override
    public List<SafeLapPoint> findSafeLapPointsForBottom(BeamInputData inputData) {
        List<SafeLapPoint> safeLapPointList = findSafeLapPointsForBottomInternal(inputData);
        List<SafeLapPoint> newList = new ArrayList<>();

        int i = 0;
        while (i < safeLapPointList.size()) {
            if (i < safeLapPointList.size() - 1 && safeLapPointList.get(i).getEnd() == safeLapPointList.get(i + 1).getBegin()) {
                SafeLapPoint point = new SafeLapPoint();
                point.setBegin(safeLapPointList.get(i).getBegin());
                point.setEnd(safeLapPointList.get(i + 1).getEnd());
                newList.add(point);
                i = i + 2;
            } else {
                newList.add(safeLapPointList.get(i));
                i++;
            }
        }
        System.out.println(newList);

        System.out.println("Check second round for edge case");
        return refineSafePoints(inputData, newList);
    }

    private List<SafeLapPoint> refineSafePoints(BeamInputData inputData, List<SafeLapPoint> newList) {
        List<SafeLapPoint> list = new ArrayList<>();
        for (SafeLapPoint point : newList) {
            if (point.getEnd() - point.getBegin() < 2 * inputData.getOverLapLength()) {
                System.out.println("Ignored " + point);
                continue;
            }
            list.add(point);

        }
        return list;

    }

    /**
     * Get First safe lap points for the bottom
     * The safe points are close to the column from both side
     * The console has overlap
     *
     * @param inputData
     * @return
     */
    private List<SafeLapPoint> findSafeLapPointsForBottomInternal(BeamInputData inputData) {
        List<SafeLapPoint> points = new ArrayList<>();
        int current = 0;
        int numberOfSpans = inputData.getSpans().length;
        int startIndex = inputData.getFirstColumnIndex() == 0 ? 0 : 1;
        int endIndex = inputData.getLastColumnIndex() == numberOfSpans - 1 ? numberOfSpans - 1 : numberOfSpans - 2;

        if (startIndex == 1) {
            current = inputData.getSpans()[0];

            SafeLapPoint sp = new SafeLapPoint();
            int startFromColumnLength = (int) Math.ceil(inputData.getBottomSafeZoneFromColumn() * inputData.getSpans()[0]);
            sp.setBegin(current);
            sp.setEnd(current - startFromColumnLength);
            sp.setSpanIndex(0);
            points.add(sp);
        }

        for (int i = startIndex; i <= endIndex; i++) {
            SafeLapPoint sp = new SafeLapPoint();
            int startFromColumnLength = (int) Math.ceil(inputData.getTopSafeZoneAwayFromColumn() * inputData.getSpans()[i]);
            sp.setBegin(current);
            sp.setEnd(current + startFromColumnLength);
            sp.setSpanIndex(i);
            points.add(sp);

            sp = new SafeLapPoint();
            sp.setBegin(current + inputData.getSpans()[i] - startFromColumnLength);
            sp.setEnd(current + inputData.getSpans()[i]);
            sp.setSpanIndex(i);
            points.add(sp);

            current += inputData.getSpans()[i];
        }

        if (endIndex == numberOfSpans - 2) {
            SafeLapPoint sp = new SafeLapPoint();
            int startFromColumnLength = (int) Math.ceil(inputData.getTopSafeZoneAwayFromColumn() * inputData.getSpans()[numberOfSpans - 1]);
            sp.setBegin(current);
            sp.setEnd(current + startFromColumnLength);
            sp.setSpanIndex(numberOfSpans - 1);
            points.add(sp);

        }

        System.out.println(points);
        return points;
    }
}
