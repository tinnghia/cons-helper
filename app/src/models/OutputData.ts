import { SplitMethod } from "./SplitMethod";

export interface OutputData {
    unit?: string;
    bar_length?: number;
    workId?: string;
    min_bars?: number;
    methods: SplitMethod[];
    displayDividedBars?: string;
}