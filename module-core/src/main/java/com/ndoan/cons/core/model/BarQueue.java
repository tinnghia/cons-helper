package com.ndoan.cons.core.model;

import java.util.ArrayList;
import java.util.List;

public class BarQueue {
    int currentIndex = 0;
    List<RealBar> remainingBars;
    List<RealBar> usedBars;

    public BarQueue() {
        remainingBars = new ArrayList<>();
        usedBars = new ArrayList<>();
    }

    public int getTotalStandardBars() {
        return (int) usedBars.stream().filter(bar -> bar.parentIndex == -1).count();
    }

    public RealBar pop(int distance) {
        int foundIdx = -1;
        for (int i = 0; i < remainingBars.size(); i++) {
            if (remainingBars.get(i).length >= distance) {
                foundIdx = i;
            }
        }

        if (foundIdx >= 0) {
            if (remainingBars.get(foundIdx).length == distance) {
                usedBars.add(remainingBars.get(foundIdx));
                return remainingBars.remove(foundIdx);
            } else {
                RealBar usedBar = RealBar.newBar(distance);
                RealBar takenBar = remainingBars.get(foundIdx);
                usedBar.parentIndex = takenBar.index;
                usedBar.index = currentIndex;
                currentIndex++;
                usedBars.add(usedBar);
                usedBars.add(takenBar);
                remainingBars.remove(foundIdx);

                RealBar remainingBar = RealBar.newBar(takenBar.length - distance);
                remainingBar.parentIndex = takenBar.index;
                push(remainingBar);

                System.out.println("Adding usedBar : " + usedBar);
                System.out.println("Adding usedBar : " + takenBar);
                System.out.println("Adding remaining : " + remainingBar);
                return usedBar;

            }
        }

        return null;
    }

    /**
     * Push to the queue standardLength of length and cut it for needLength of length
     * make sure to push the remain to the queue
     * @param standardLength
     * @param needLength
     * @return
     */
    public RealBar pushAndCut(int standardLength, int needLength) {
        push(standardLength);
        return pop(needLength);
    }

    public RealBar push(int length) {
        RealBar remainingBar = RealBar.newBar(length);
        push(remainingBar);
        return remainingBar;
    }

    public void push(RealBar remainingBar) {
        remainingBar.index = currentIndex;
        remainingBars.add(remainingBar);
        currentIndex++;
        remainingBars.sort((a, b) -> a.length - b.length);
    }

    protected BarQueue clone() {
        BarQueue list = new BarQueue();
        for (int i = 0; i < remainingBars.size(); i++) {
            list.remainingBars.add(remainingBars.get(i).clone());
        }
        for (int i = 0; i < usedBars.size(); i++) {
            list.usedBars.add(usedBars.get(i).clone());
        }
        list.currentIndex = this.currentIndex;
        return list;
    }

    public RealBar findRootBar(RealBar bar) {
        RealBar current = bar;
        while (current.parentIndex != -1) {
            for (int i = 0; i < usedBars.size(); i++) {
                if (usedBars.get(i).index == current.parentIndex) {
                    current = usedBars.get(i);
                    break;
                }
            }
        }
        return current;
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("     Remaining bars:");
        for (RealBar bar : remainingBars) {
            builder.append(bar);
        }

        builder.append("\n");
        builder.append("       Used bars:");
        for (RealBar bar : usedBars) {
            builder.append(bar);
        }
        builder.append(" total bar needed: " + getTotalStandardBars());
        return builder.toString();
    }
}
