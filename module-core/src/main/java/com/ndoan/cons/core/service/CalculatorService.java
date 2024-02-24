package com.ndoan.cons.core.service;

import com.ndoan.cons.core.dto.InputData;
import com.ndoan.cons.core.dto.OutputData;
import com.ndoan.cons.core.dto.OutputSet;
import com.ndoan.cons.core.dto.OutputSplit;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CalculatorService {
    public OutputData optimizeCut (InputData inputData) {
        return sampleOutput();
    }

    private OutputData sampleOutput() {
        OutputData outputData = new OutputData();
        outputData.setMin_bars(11);

        List<OutputSet> sets = new ArrayList<>();

        OutputSet set1 = new OutputSet();
        set1.setTotal(2);
        set1.setRemain_per_each(0.5);

        List<OutputSplit> split1 = new ArrayList<>();
        OutputSplit split1_1 = new OutputSplit();
        split1_1.setLength(1.2);
        split1_1.setTotal(1);
        OutputSplit split1_2 = new OutputSplit();
        split1_2.setLength(2.2);
        split1_2.setTotal(2);

        split1.add(split1_1);
        split1.add(split1_2);

        set1.setSplit(split1);

        OutputSet set2 = new OutputSet();
        set2.setTotal(3);
        set2.setRemain_per_each(0.2);

        List<OutputSplit> split2 = new ArrayList<>();
        OutputSplit split2_1 = new OutputSplit();
        split2_1.setLength(2.2);
        split2_1.setTotal(1);
        OutputSplit split2_2 = new OutputSplit();
        split2_2.setLength(3.2);
        split2_2.setTotal(3);

        split2.add(split2_1);
        split2.add(split2_2);

        set2.setSplit(split2);

        sets.add(set1);
        sets.add(set2);

        outputData.setSet(sets);
        return outputData;
    }
}
