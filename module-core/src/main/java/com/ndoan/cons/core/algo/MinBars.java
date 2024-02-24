package com.ndoan.cons.core.algo;

import com.ndoan.cons.core.model.CombinationSet;
import com.ndoan.cons.core.model.CombinationSetIndices;

import java.util.ArrayList;
import java.util.List;

public class MinBars {
    public static int minBars(int M, int[] lengths, int[] totals) {
        List<CombinationSet> list = new ArrayList<>();
        CombinationSet set = new CombinationSet();
        set.setLengths(lengths);
        set.setTotals(new int[lengths.length]);
        findTheSet(M, lengths, lengths.length, 0, list, set); //==> 11 sets

        int[] result = new int[list.size()];
        List<CombinationSetIndices> indices = new ArrayList<>();
        minBars01(M, totals, list, indices, result, 0);

        indices.sort((t1, t2) -> {
            return t1.getTotal() - t2.getTotal();
        });
        int min = indices.get(0).getTotal();
        System.out.println("FINAL : " + min);
        for (int i = 0; i < indices.size(); i++) {
            if (indices.get(i).getTotal() == min) {
                for (int l = 0; l < indices.get(i).getIndices().length; l++) {
                    if (indices.get(i).getIndices()[l] > 0) {
                        System.out.print(list.get(l) + " * " + indices.get(i).getIndices()[l] + " ;");
                    }
                }
                System.out.println();
            }
        }
        return 0;
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

        if (index >= list.size()) {
            if (meet(totals, list, result)) {
                System.out.println("Result ==> ");
                for (int i = 0; i < result.length; i++) {
                    if (result[i] != 0) {
                        System.out.print(list.get(i) + " * " + result[i] + " ; ");
                        CombinationSetIndices idx = new CombinationSetIndices();
                        idx.setIndices(new int[result.length]);
                        for (int y = 0; y < result.length; y++) {
                            idx.getIndices()[y] = result[y];
                            idx.setTotal(idx.getTotal() + idx.getIndices()[y]);
                        }

                        indices.add(idx);
                    }
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

    /*

    input
    {
       "unit" : "m",
       "bar_length": 11.7
       subs:[
        {
           "length": 1.2,
           "total": 3
        },
        {
           "length": 2.2,
           "total": 4
        }
       ]
    }
    output
    {
       min_bars: 11,
       set:[
           {
            "total": 2
            "split": [
                 {
                   "length": 1.2,
                   "total": 1
                 },
                 {
                   "length": 2.2,
                   "total": 2
                }
                ],
           "remain_per_each" : 0.5
          },

          {
            "total": 3
            "split": [
                 {
                   "length": 2.2,
                   "total": 1
                 },
                 {
                   "length": 3.2,
                   "total": 3
                }
                ],
           "remain_per_each" : 0.2
          }
        ]
    }

     */
    public static void main(String[] args) {
        int M = 117;
        List<CombinationSet> list = new ArrayList<>();
        int[] lengths = new int[]{117, 33, 36};
        //int[] totals = new int[]{5,6,3};
        int[] totals = new int[]{5, 7, 9};
        CombinationSet set = new CombinationSet();
        set.setLengths(lengths);
        set.setTotals(new int[lengths.length]);
        findTheSet(M, lengths, 3, 0, list, set); //==> 11 sets
        System.out.println(list.size());

        minBars(M, lengths, totals);


    }

}
