package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.dto.InputData;
import com.ndoan.cons.core.dto.OutputData;
import com.ndoan.cons.core.dto.SplitMethod;
import com.ndoan.cons.core.dto.SubsData;
import com.ndoan.cons.core.model.*;

import java.util.*;

public class DesignBeam {


    SafeLapPointFinderImpl safeLapPointFinder;
    RealBarArranger realBarArranger;

    TopMainBarFinder topMainBarFinder;
    BottomMainBarFinder bottomMainBarFinder;

    BeamInputProcessor beamInputProcessor;

    public DesignBeam() {
        safeLapPointFinder = new SafeLapPointFinderImpl();
        realBarArranger = new RealBarArrangerWithIncreasingDelta();

        topMainBarFinder = new TopMainBarFinder(safeLapPointFinder, realBarArranger);
        bottomMainBarFinder = new BottomMainBarFinder(safeLapPointFinder, realBarArranger);

        beamInputProcessor = new BeamInputProcessorImpl();
    }

    public MultiBeamListOutputData designForMulti(BeamInputData[] inputDataList) {
        MultiBeamListOutputData multiBeamListOutputData = new MultiBeamListOutputData();
        BeamListOutputData beamList =  design(inputDataList);

        multiBeamListOutputData.setBeamList(new ArrayList<>());
        multiBeamListOutputData.getBeamList().add(beamList);
        multiBeamListOutputData.setWorkId(UUID.randomUUID().toString());
        return multiBeamListOutputData;
    }
    public BeamListOutputData design(BeamInputData[] inputDataList) {
        BeamOutputData[] outputDataList = new BeamOutputData[inputDataList.length];

        for (int i = 0; i < inputDataList.length; i++) {
            System.out.println("DESIGN DESIGN " + i);
            outputDataList[i] = designSingle(inputDataList[i]);
        }

        InputData inputData = buildInputDataForCutting(inputDataList[0], outputDataList);
        OutputData splitOutputData = MinBars.optimizeBars(inputData);
        SplitMethod splitMethod = chooseMethod(splitOutputData);

        SpanBarQueue spanBarQueue = new SpanBarQueue();
        spanBarQueue.add(splitMethod);

        for (int i = 0; i < inputDataList.length; i++) {
            updateBarInBeam(spanBarQueue, outputDataList[i]);
        }

        BeamListOutputData beamListOutputData = new BeamListOutputData();
        beamListOutputData.setOutputDataList(Arrays.asList(outputDataList));
        beamListOutputData.setBarQueue(spanBarQueue);
        beamListOutputData.setUnit(inputData.getUnit());

        return beamListOutputData;
    }

    public void updateBarInBeam(SpanBarQueue spanBarQueue, BeamOutputData beamOutputData) {
        updateBars(spanBarQueue, beamOutputData.getTopBars());
        updateBars(spanBarQueue, beamOutputData.getBottomBars());
    }

    private void updateBars(SpanBarQueue spanBarQueue, List<SolutionMainBar> bars) {
        for (SolutionMainBar bar : bars) {
            for (SolutionSpliceBar spliceBar : bar.getBars()) {
                int length = spliceBar.getBeginAnchor() + spliceBar.getEndAnchor() + spliceBar.getEndValue() - spliceBar.getBeginValue();
                Optional<SpanBar> spanBar = spanBarQueue.findAndRemove(length);
                if(spanBar.isPresent()) {
                    spliceBar.setRefBar(spanBar.get());
                }

            }
        }
    }

    private InputData buildInputDataForCutting(BeamInputData beamData, BeamOutputData[] outputDataList) {
        InputData inputData = new InputData();
        inputData.setBar_length(beamData.getStandardBarLength());
        inputData.setUnit("m");
        List<SubsData> subsDataList = new ArrayList<>();
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < outputDataList.length; i++) {
            map = storeBars(map, outputDataList[i].getTopBars());
            map = storeBars(map, outputDataList[i].getBottomBars());
        }

        for(int length : map.keySet()) {
            SubsData subsData = new SubsData();
            subsData.setLength(length);
            subsData.setTotal(map.get(length));

            subsDataList.add(subsData);
        }

        for(int i =0;i< beamData.getRebars().length; i++) {
            SubsData subsData = new SubsData();
            subsData.setLength(beamData.getRebars()[i].getLength());
            subsData.setTotal(beamData.getRebars()[i].getNumber());

            subsDataList.add(subsData);
        }

        inputData.setSubs(subsDataList);

        return inputData;
    }

    private Map<Integer, Integer> storeBars(Map<Integer, Integer> map, List<SolutionMainBar> bars) {
        for (SolutionMainBar bar : bars) {
            for (SolutionSpliceBar spliceBar : bar.getBars()) {
                int length = spliceBar.getBeginAnchor() + spliceBar.getEndAnchor() + spliceBar.getEndValue() - spliceBar.getBeginValue();
                if (map.containsKey(length)) {
                    map.put(length, map.get(length) + 1);
                } else {
                    map.put(length, 1);
                }

            }
        }
        return map;
    }

    private SplitMethod chooseMethod(OutputData outputData) {
        return outputData.getMethods().get(0);
    }

    public BeamOutputData designSingle(BeamInputData inputData) {
        BeamOutputData outputData = new BeamOutputData();
        inputData = beamInputProcessor.processInput(inputData);

        outputData.setId(inputData.getId());
        outputData.setName(inputData.getName());
        List<SolutionMainBar> topBars = topMainBarFinder.find(inputData);
        List<SolutionMainBar> bottomBars = bottomMainBarFinder.find(inputData);

        List<SolutionMainBar> pickedTopBars = new ArrayList<>();
        List<SolutionMainBar> pickedBottomBars = new ArrayList<>();

        for (int i = 0; i < inputData.getTopMainBars(); i++) pickedTopBars.add(topBars.get(i));
        for (int i = 0; i < inputData.getBottomMainBars(); i++) pickedBottomBars.add(bottomBars.get(i));

        List<SolutionMainBar> allPicked = new ArrayList<>();
        allPicked.addAll(pickedTopBars);
        allPicked.addAll(pickedBottomBars);
        boolean checkTop = DesignBeamHelpers.checkMainBarsMeet50PercentCondition(pickedTopBars);
        boolean checkBottom = DesignBeamHelpers.checkMainBarsMeet50PercentCondition(pickedBottomBars);
        boolean checkAllMeet = DesignBeamHelpers.checkMainBarsMeet50PercentCondition(allPicked);

        System.out.println("checkTop = " + checkTop + ", checkBottom" + checkBottom + ", checkAllMeet" + checkAllMeet);

        outputData.setTopBars(pickedTopBars);
        outputData.setBottomBars(pickedBottomBars);


        inputData.setNeedBeginAnchor(inputData.getFirstColumnIndex() == 0);
        inputData.setNeedEndAnchor(inputData.getLastColumnIndex() == inputData.getSpans().length - 1);

        List<Integer> indexes = new ArrayList<>();
        if (inputData.getFirstColumnIndex() == 0) {
            indexes.add(0);
        }
        int currentLength = 0;
        for (int i = 0; i < inputData.getSpans().length - 1; i++) {
            currentLength = currentLength + inputData.getSpans()[i];
            indexes.add(currentLength);
        }
        if (inputData.getLastColumnIndex() == inputData.getSpans().length - 1) {
            indexes.add(currentLength + inputData.getSpans()[inputData.getSpans().length - 1]);
        }

        outputData.setIndexes(indexes.stream().mapToInt(i -> i).toArray());
        return outputData;
    }

    public static void main(String[] args) {
        DesignBeam designBeam = new DesignBeam();
        BeamInputData inputData = new BeamInputData();

        inputData.setStandardBarLength(11700); //mm
        inputData.setAnchorLength(15);
        inputData.setSpans(new int[]{5000, 3000, 12000, 8000, 2000});
        inputData.setFirstColumnIndex(0);
        inputData.setLastColumnIndex(4);  // last -1
        inputData.setLabLength(30);
        inputData.setAnchorLength(15);
        inputData.setMainBarDiameter(22); //d22 = 22mm
        inputData.setTopSafeZoneAwayFromColumn(0.25);
        inputData.setBottomSafeZoneFromColumn(0.25);
        inputData.setTopMainBars(3);
        inputData.setBottomMainBars(3);


        //BeamInputData(id=1, standardBarLength=11700, mainBarDiameter=22, rifBarDiameter=18, labLength=30, anchorLength=15, topMainBars=3, bottomMainBars=3, topSafeZoneAwayFromColumn=0.25, bottomSafeZoneFromColumn=0.25, firstColumnIndex=0, lastColumnIndex=4, spans=[5000, 3000, 12000, 8000, 2000], rebars=[], eachAnchorLength=0, totalLengh=0, minStandardBars=0, overLapLength=0, needBeginAnchor=false, needEndAnchor=false, stepsBetweenOverlapSolutions=10)
        //BeamOutputData outputData = designBeam.designSingle(inputData);

        BeamListOutputData outputData = designBeam.design(new BeamInputData[]{inputData});

        System.out.println(outputData.getOutputDataList());


    }

}

