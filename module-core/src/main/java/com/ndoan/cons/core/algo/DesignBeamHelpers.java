package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.model.Range;
import com.ndoan.cons.core.model.SolutionMainBar;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

public class DesignBeamHelpers {
    public static Range findCommonRangeOfSubset(List<Range> ranges, int subsetLength) {
        return findCommonRangeOfSubsetHelper(ranges, subsetLength, 0, new ArrayList<>());
    }

    private static Range findCommonRangeOfSubsetHelper(List<Range> ranges, int subsetLength, int index, List<Range> subset) {
        if (subset.size() == subsetLength) {
            return findCommonRange(subset);
        }

        if (index >= ranges.size()) {
            return null;
        }

        // Include current range
        subset.add(ranges.get(index));
        Range commonRangeWithCurrent = findCommonRangeOfSubsetHelper(ranges, subsetLength, index + 1, subset);
        subset.remove(subset.size() - 1);

        // Exclude current range
        Range commonRangeWithoutCurrent = findCommonRangeOfSubsetHelper(ranges, subsetLength, index + 1, subset);

        // Return the common range
        if (commonRangeWithCurrent != null && commonRangeWithoutCurrent != null) {
            return commonRangeWithCurrent.getBegin() <= commonRangeWithoutCurrent.getBegin() ? commonRangeWithCurrent : commonRangeWithoutCurrent;
        } else {
            return commonRangeWithCurrent != null ? commonRangeWithCurrent : commonRangeWithoutCurrent;
        }
    }

    public static Range findCommonRange(List<Range> ranges) {
        int commonBegin = Integer.MIN_VALUE;
        int commonEnd = Integer.MAX_VALUE;

        for (Range range : ranges) {
            commonBegin = Math.max(commonBegin, range.getBegin());
            commonEnd = Math.min(commonEnd, range.getEnd());
        }

        // Check if the ranges actually overlap
        if (commonBegin <= commonEnd) {
            return new Range(commonBegin, commonEnd, 0);
        } else {
            // No overlap, return null
            return null;
        }
    }

    public static boolean findCommonRange(List<SolutionMainBar> bars, int size) {
        int commonBegin = Integer.MIN_VALUE;
        int commonEnd = Integer.MAX_VALUE;

        for (SolutionMainBar bar : bars) {
            commonBegin = Math.max(commonBegin, bar.getBars().get(0).getBeginValue());
            commonEnd = Math.min(commonEnd, bar.getBars().get(bar.getBars().size()-1).getEndValue());
        }

        System.out.println("commonBegin = " + commonBegin + " commonEnd = " + commonEnd);
        int counter = 0;
        for(int i =commonBegin;i<=commonEnd;i++) {
            counter = 0;
            for(SolutionMainBar bar : bars ) {
                if(bar.checkHasPostionAtOverlap(i))
                    counter = counter +1;
                if(counter==size)
                    return true;

            }
        }
        return false;
    }

    public static Range findCommonRange(Range r1, Range r2) {
        System.out.println("findCommonRange " + r1 + "," + r2);
        int commonBegin = Math.max(r1.getBegin(), r2.getBegin());
        int commonEnd = Math.min(r1.getEnd(), r2.getEnd());

        // Check if the ranges actually overlap
        if (commonBegin <= commonEnd) {
            Range common =  new Range(commonBegin, commonEnd, 0);
            System.out.println("---findCommonRange--: " + r1 + " -- " + r2 + " = " + common);
            return common;
        } else {
            // No overlap, return null
            return null;
        }
    }

    public static boolean checkMainBarsMeet50PercentCondition(List<SolutionMainBar> bars) {
        int totalBars = bars.size();
        int over50PercentNumber = totalBars/2 + 1;
        System.out.println("over50PercentNumber=" + over50PercentNumber);
        /*List<Range> ranges = new ArrayList<>();
        for(SolutionMainBar bar : bars) {
            List<Range> br = bar.getRanges();
            System.out.println(br);
            ranges.addAll(br);
        }

        Range commonRange = findCommonRangeOfSubset(ranges, over50PercentNumber);
        System.out.println("commonRange=" + commonRange);
        return commonRange == null;
        */
        return !findCommonRange(bars, over50PercentNumber);
    }

    public static boolean checkMainBarsMeet50PercentCondition(List<SolutionMainBar> bars, int[] indices) {
        int totalBars = indices.length;
        int over50PercentNumber = totalBars/2 + 1;
       // System.out.println("over50PercentNumber=" + over50PercentNumber);
        List<Range> ranges = new ArrayList<>();
        for(int i = 0;i<indices.length;i++) {
            List<Range> br = bars.get(i).getRanges();
            //System.out.println(br);
            ranges.addAll(br);
        }

        Range commonRange = findCommonRangeOfSubset(ranges, over50PercentNumber);
        //System.out.println("commonRange=" + commonRange);
        return commonRange == null;
    }


    public static List<List<Integer>> generateSubsetsOfSize(List<Integer> items, int size) {
        List<List<Integer>> subsets = new ArrayList<>();
        generateSubsetsOfSizeHelper(items, size, 0, new ArrayList<>(), subsets);
        return subsets;
    }

    private static void generateSubsetsOfSizeHelper(List<Integer> items, int size, int startIndex, List<Integer> currentSubset, List<List<Integer>> subsets) {
        if (currentSubset.size() == size) {
            subsets.add(new ArrayList<>(currentSubset));
            return;
        }

        for (int i = startIndex; i < items.size(); i++) {
            currentSubset.add(items.get(i));
            generateSubsetsOfSizeHelper(items, size, i + 1, currentSubset, subsets);
            currentSubset.remove(currentSubset.size() - 1);
        }
    }



    public static void generateSubsets(int N, int S, List<SolutionMainBar> bars) {
        int[] subset = new int[S];

        // Initialize subset with the first combination (0, 1, 2, ..., S-1)
        for (int i = 0; i < S; i++) {
            subset[i] = i;
        }

        // Generate subsets iteratively
        while (subset[0] <= N - S) {
            //process subset here
            //boolean check = DesignBeamHelpers.checkMainBarsMeet50PercentCondition(bars, subset);
            //if (check)
             //   System.out.println("Subset " + " meeted");

            int i = S - 1;
            while (i >= 0 && subset[i] == N - S + i) {
                i--;
            }
            if (i < 0) {
                break;
            }
            subset[i]++;
            for (int j = i + 1; j < S; j++) {
                subset[j] = subset[j - 1] + 1;
            }
        }
    }

    public static List<List<Integer>> generateSubsets(int N, int S) {
        List<List<Integer>> subsets = new ArrayList<>();
        generateSubsetsUtil(subsets, new ArrayList<>(), 0, N, S);
        return subsets;
    }

    private static void generateSubsetsUtil(List<List<Integer>> subsets, List<Integer> current, int i, int N, int S) {
        if (current.size() == S) {
            //subsets.add(new ArrayList<>(current)); // Create a copy to avoid modification
            return;
        }

        if (i == N) {
            return;
        }

        // Include current element
        current.add(i);
        generateSubsetsUtil(subsets, current, i + 1, N, S);
        current.remove(current.size() - 1);

        // Exclude current element
        generateSubsetsUtil(subsets, current, i + 1, N, S);
    }

    public static void main(String[] args) {
        int N = 20;
        int S = 9;
        List<List<Integer>> subsets = generateSubsetsBitwise(N, S);
        System.out.println("All subsets of size " + S + " from set {0, 1, 2}:" + subsets.size());

    }

    public static List<List<Integer>> generateSubsetsBitwise(int N, int S) {
        List<List<Integer>> subsets = new ArrayList<>();
        for (long i = 0; i < (1L << N); i++) { // Use long to avoid overflow
            List<Integer> subset = new ArrayList<>();
            for (int j = 0; j < N; j++) {
                if (((i >> j) & 1) == 1) {
                    subset.add(j);
                }
            }
            if (subset.size() == S) {
                subsets.add(subset);
            }
        }
        return subsets;
    }


    public static List<List<Integer>> generateSubsetsBitwise1(int N, int S) {
        List<List<Integer>> subsets = new ArrayList<>();
        for (int i = 0; i < (1 << N); i++) { // Iterate through all possible binary numbers
            List<Integer> subset = new ArrayList<>();
            for (int j = 0; j < N; j++) {
                if ((i & (1 << j)) > 0) { // Check if jth bit is set
                    subset.add(j);
                }
            }
            if (subset.size() == S) {
                subsets.add(subset);
            }
        }
        return subsets;
    }

    public static List<List<Integer>> generateSubsetsIterative(int N, int S) {
        List<List<Integer>> subsets = new ArrayList<>();
        Stack<List<Integer>> stack = new Stack<>();
        stack.push(new ArrayList<>()); // Start with empty subset

        while (!stack.isEmpty()) {
            List<Integer> current = stack.pop();
            if (current.size() == S) {
                //subsets.add(new ArrayList<>(current)); // Create a copy
                continue;
            }

            for (int i = current.isEmpty() ? 0 : current.get(current.size() - 1) + 1; i < N; i++) {
                List<Integer> next = new ArrayList<>(current);
                next.add(i);
                stack.push(next);
            }
        }

        return subsets;
    }
}
