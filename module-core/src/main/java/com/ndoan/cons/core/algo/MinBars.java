package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.dto.*;
import com.ndoan.cons.core.model.CombinationResult;
import com.ndoan.cons.core.model.CombinationSet;
import com.ndoan.cons.core.model.CombinationSetIndices;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class MinBars {

    private final static int TOTAL_SOLUTION = 1;
    private final static int MAX_TOTAL_BARS = 3000;

    public static OutputData optimizeBars(InputData inputData) {
        int[] lengths = new int[inputData.getSubs().size()];
        int[] totals = new int[inputData.getSubs().size()];
        double[] doubles = new double[lengths.length + 1];
        doubles[0] = inputData.getBar_length();
        for (int i = 0; i < lengths.length; i++) {
            doubles[i + 1] = inputData.getSubs().get(i).getLength();
        }
        int maxTen = getTen(doubles);
        maxTen = (int) Math.pow(10, maxTen);
        for (int i = 0; i < lengths.length; i++) {
            lengths[i] = (int) (inputData.getSubs().get(i).getLength() * maxTen);
            totals[i] = inputData.getSubs().get(i).getTotal();
        }

        int barLength = (int) (inputData.getBar_length() * maxTen);
        CombinationResult combinationResult = minBars(barLength, lengths, totals);

        List<CombinationSetIndices> resultList = combinationResult.getResultIndices();
        List<CombinationSet> combinationSets = combinationResult.getCombinationSets();
        OutputData outputData = new OutputData();
        outputData.setWorkId(UUID.randomUUID().toString());
        outputData.setUnit(inputData.getUnit());
        outputData.setBar_length(inputData.getBar_length());
        outputData.setMin_bars(resultList.get(0).getTotal());
        outputData.setDisplayDividedBars(parseDisplayDividedBars(inputData));
        outputData.setMethods(new ArrayList<>());


        for (CombinationSetIndices combinationSetIndices : resultList) {
            SplitMethod splitMethod = new SplitMethod();
            List<OutputSet> set = new ArrayList<>();
            for (int l = 0; l < combinationSetIndices.getIndices().length; l++) {
                if (combinationSetIndices.getIndices()[l] > 0) {
                    OutputSet outputSet = new OutputSet();
                    outputSet.setTotal(combinationSetIndices.getIndices()[l]);
                    outputSet.setSplit(new ArrayList<>());
                    //double remain =  ((barLength - combinationSets.get(l).getSum()) * 1.0)/ maxTen;
                    int remain = barLength - combinationSets.get(l).getSum();
                    outputSet.setRemain_per_each(remain);
                    for (int k = 0; k < lengths.length; k++) {
                        OutputSplit split = new OutputSplit();
                        split.setLength(inputData.getSubs().get(k).getLength());
                        split.setTotal(combinationSets.get(l).getTotals()[k]);
                        outputSet.getSplit().add(split);
                    }
                    outputSet.setDisplaySplit(parseDisplaySplit(outputSet));
                    set.add(outputSet);
                    //System.out.print(combinationSets.get(l) + " * " + combinationSetIndices.getIndices()[l] + " ;");
                }
            }
            splitMethod.setSet(set);
            splitMethod.setDisplayRemain(parseDisplayRemain(splitMethod));
            outputData.getMethods().add(splitMethod);
        }


        return outputData;
    }

    static String parseDisplayDividedBars(InputData inputData) {
        return inputData.getSubs().stream().map(sb -> String.valueOf(sb.getLength())).collect(Collectors.joining(", "));
    }

    static String parseDisplayRemain(SplitMethod splitMethod) {
        return splitMethod.getSet().stream().filter(sps -> sps.getRemain_per_each() > 0).map(sps -> {
            return sps.getTotal() + " * " + sps.getRemain_per_each();
        }).collect(Collectors.joining(", "));
    }

    static String parseDisplaySplit(OutputSet outputSet) {
        return outputSet.getSplit().stream().filter(split -> split.getTotal() > 0).map(split -> {
            return split.getTotal() + " * " + split.getLength();
        }).collect(Collectors.joining(", "));
    }

    static int getTen(double... doubleList) {
        int maxNonZeroDigit = 0;

        // Iterate through each double in the list
        for (double number : doubleList) {
            // Extract the fractional part of the double
            double fractionalPart = number - Math.floor(number);
            fractionalPart = Math.round(fractionalPart * 10000.0) / 10000.0;
            // Skip if the fractional part is zero
            if (fractionalPart == 0) {
                continue;
            }

            // Multiply the fractional part by 10 until it becomes an integer
            int nonZeroDigits = 0;
            while (fractionalPart > 0) {
                fractionalPart *= 10;
                // Check if the current digit is non-zero
                fractionalPart = fractionalPart - (int) (fractionalPart % 10);
                fractionalPart = Math.round(fractionalPart * 10000.0) / 10000.0;
                nonZeroDigits++;
            }

            // Update the maximum non-zero digit if necessary
            maxNonZeroDigit = Math.max(maxNonZeroDigit, nonZeroDigits);
        }
        return maxNonZeroDigit;

    }

    public static CombinationResult minBars(int M, int[] lengths, int[] totals) {
        CombinationResult combinationResult = new CombinationResult();
        List<CombinationSet> list = new ArrayList<>();
        CombinationSet set = new CombinationSet();
        set.setLengths(lengths);
        set.setTotals(new int[lengths.length]);
        findTheSet(M, lengths, lengths.length, 0, list, set); //==> 11 sets

        list.sort((cs1, cs2) -> isArr1GreaterThanArr2(cs1.getTotals(), cs2.getTotals()));
        int[] result = new int[list.size()];
        List<CombinationSetIndices> indices = new ArrayList<>();
        minBars01(M, totals, list, indices, result, 0);

        indices.sort((t1, t2) -> {
            return t1.getTotal() - t2.getTotal();
        });
        int min = indices.get(0).getTotal();
        List<CombinationSetIndices> finalList = new ArrayList<>();
        System.out.println("FINAL : " + min);
        for (int i = 0; i < indices.size(); i++) {
            if (indices.get(i).getTotal() == min) {
                int numberCuts = 0;
                for (int l = 0; l < indices.get(i).getIndices().length; l++) {
                    if (indices.get(i).getIndices()[l] > 0) {
                        System.out.print(list.get(l) + " * " + indices.get(i).getIndices()[l] + " ;");
                        numberCuts = numberCuts + indices.get(i).getIndices()[l] * Arrays.stream(list.get(l).getTotals()).reduce(0, Integer::sum);
                    }
                }
                indices.get(i).setNumberCuts(numberCuts);
                finalList.add(indices.get(i));
                System.out.println();
            }
        }

        finalList.sort((t1, t2) -> t1.getNumberCuts() - t2.getNumberCuts());
        combinationResult.setCombinationSets(list);
        combinationResult.setResultIndices(finalList);
        return combinationResult;
    }

    public static int isArr1GreaterThanArr2(int[] arr1, int[] arr2) {
        return Arrays.stream(arr2).sum() - Arrays.stream(arr1).sum();
    }

    public static void findTheSet(int M, int[] lengths, int numbers, int i, List<CombinationSet> list, CombinationSet set) {
        if (i >= numbers) {
            if (set.getSum() > 0) {
                CombinationSet copiedSet = new CombinationSet();
                copiedSet.setLengths(lengths);
                copiedSet.setTotals(new int[numbers]);
                for (int x = 0; x < numbers; x++)
                    copiedSet.getTotals()[x] = set.getTotals()[x];
                copiedSet.setSum(set.getSum());
                System.out.println(set);
                list.add(copiedSet);
            }
            return;
        }
        if (set.getSum() + lengths[i] <= M) {
            set.getTotals()[i]++;
            set.setSum(set.getSum() + lengths[i]);
            findTheSet(M, lengths, numbers, i, list, set);
            set.getTotals()[i]--;
            set.setSum(set.getSum() - lengths[i]);
            findTheSet(M, lengths, numbers, i + 1, list, set);
        } else {
            findTheSet(M, lengths, numbers, i + 1, list, set);
        }
    }

    public static void minBars01(int M, int[] totals, List<CombinationSet> list, List<CombinationSetIndices> indices, int[] result, int index) {

        if (indices.size() == TOTAL_SOLUTION) {
            return;
        }
        if (index >= list.size()) {
            if (meet(totals, list, result)) {
                System.out.println("Result ==> ");
                for (int i = 0; i < result.length; i++) {
                    if (result[i] != 0) {
                        System.out.print(list.get(i) + " * " + result[i] + " ; ");
                    }
                }
                CombinationSetIndices idx = new CombinationSetIndices();
                int currentTotal = indices.size() > 0 ? indices.get(indices.size() - 1).getTotal() : MAX_TOTAL_BARS;
                int total = Arrays.stream(result).sum();
                if (currentTotal > total) {
                    idx.setIndices(new int[result.length]);
                    for (int y = 0; y < result.length; y++) {
                        idx.getIndices()[y] = result[y];
                        idx.setTotal(idx.getTotal() + idx.getIndices()[y]);
                    }

                    indices.add(idx);
                    System.out.println(idx.getTotal() + " - > indexes --- size = " + indices.size());
                }
            }
            return;
        }
        if (lessthan(totals, list, result)) {
            result[index]++;
            minBars01(M, totals, list, indices, result, index);
            result[index]--;
            minBars01(M, totals, list, indices, result, index + 1);
        } else {
            minBars01(M, totals, list, indices, result, index + 1);
        }

    }

    private static boolean meet(int[] totals, List<CombinationSet> list, int[] result) {
        for (int k = 0; k < totals.length; k++) {
            int tt = 0;
            for (int i = 0; i < list.size(); i++) {
                tt += list.get(i).getTotals()[k] * result[i];
            }
            if (tt != totals[k])
                return false;
        }
        return true;

    }

    private static boolean lessthan(int[] totals, List<CombinationSet> list, int[] result) {
        for (int k = 0; k < totals.length; k++) {
            int tt = 0;
            for (int i = 0; i < list.size(); i++) {
                tt += list.get(i).getTotals()[k] * result[i];
            }
            //System.out.println(tt);
            if (tt > totals[k]) {

                return false;
            }
        }
        return true;

    }

    public static void main(String[] args) {
        /*int M = 117;
        List<CombinationSet> list = new ArrayList<>();
        int[] lengths = new int[]{117, 33, 36};
        int[] totals = new int[]{5,6,3};
        //int[] totals = new int[]{5, 7, 9};
        CombinationSet set = new CombinationSet();
        set.setLengths(lengths);
        set.setTotals(new int[lengths.length]);
        findTheSet(M, lengths, 3, 0, list, set); //==> 11 sets
        System.out.println(list.size());

        minBars(M, lengths, totals);

        System.out.println("GT" + getTen(11.7, 3.3, 3.6));
         */


        InputData inputData = new InputData();
        inputData.setBar_length(117);
        inputData.setUnit("m");
        List<SubsData> subsDataList = new ArrayList<>();
        SubsData sub1 = new SubsData();
        sub1.setLength(117);
        sub1.setTotal(5);
        subsDataList.add(sub1);
        SubsData sub2 = new SubsData();
        sub2.setLength(33);
        sub2.setTotal(7);
        subsDataList.add(sub2);
        SubsData sub3 = new SubsData();
        sub3.setLength(36);
        sub3.setTotal(9);
        subsDataList.add(sub3);

        inputData.setSubs(subsDataList);

        OutputData outputData = optimizeBars(inputData);
        System.out.println(outputData);
        List<SplitMethod> methods = outputData.getMethods();

        for (int i = 0; i < methods.size(); i++) {
            System.out.println("method : " + i);
            List<OutputSet> list = methods.get(i).getSet();
            for (OutputSet set : list) {
                System.out.print(" total of  set : " + set.getTotal() + " ");
                List<OutputSplit> splits = set.getSplit();
                for (OutputSplit split : splits) {
                    System.out.print(split.getLength() + "x" + split.getTotal() + " ");
                }

                System.out.println();
            }
        }


    }

}
