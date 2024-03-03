import { Split } from "./Split";

export interface SplitSet {
    total: number;
    remain_per_each: number;
    split: Split[];
    displaySplit: string;
}