package com.ndoan.cons.core.service;

import com.ndoan.cons.core.algo.MinBars;
import com.ndoan.cons.core.cache.CacheManager;
import com.ndoan.cons.core.dto.*;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;


import java.io.*;
import java.util.*;

@Service
public class CalculatorService implements InitializingBean {

    List<XWPFParagraph> inputOutputParagraphs;
    List<XWPFParagraph> methodHeaderParagraphs;
    List<XWPFParagraph> methodSplitParagraphs;

    List<XWPFParagraph> methodRemainParagraphs;
    String language = "vn";
    @Override
    public void afterPropertiesSet() throws Exception {
        XWPFDocument methodDoc = new XWPFDocument(CalculatorService.class.getClassLoader().getResourceAsStream("templates/" + language + "/method-doc.docx"));
        methodHeaderParagraphs = methodDoc.getParagraphs();

        XWPFDocument splitDoc = new XWPFDocument(CalculatorService.class.getClassLoader().getResourceAsStream("templates/"+ language +"/split-doc.docx"));
        methodSplitParagraphs = splitDoc.getParagraphs();

        XWPFDocument remainDoc = new XWPFDocument(CalculatorService.class.getClassLoader().getResourceAsStream("templates/"+ language +"/method-remain.docx"));
        methodRemainParagraphs = remainDoc.getParagraphs();

        XWPFDocument inputOutputDoc = new XWPFDocument(CalculatorService.class.getClassLoader().getResourceAsStream("templates/"+ language +"/result-doc.docx"));
        inputOutputParagraphs = inputOutputDoc.getParagraphs();
    }

    public OutputData optimizeBars(InputData inputData) {
        OutputData outputData =  MinBars.optimizeBars(inputData);
        CacheManager.getInstance().put(outputData.getWorkId(), outputData);
        return outputData;
    }

    public String generateWordDoc(String userId, String workId) throws IOException {
        String path = "/Users/nghiadoan/Development/cons-helper/data/" + userId + "-"  + System.currentTimeMillis() + ".docx";
        OutputData outputData = CacheManager.getInstance().get(workId);
        generateWordDocInternal(path,outputData);
        return path;
    }


    public void generateWordDocInternal(String outputPath, OutputData outputData) throws IOException {
        try (FileOutputStream fos = new FileOutputStream(outputPath)) {
            XWPFDocument mainDoc = new XWPFDocument();
            copyHeader(mainDoc, outputData);
            for (int i = 1; i <= outputData.getMethods().size(); i++) {
                copyMethod(mainDoc, i, outputData.getMethods().get(i - 1));
            }
            mainDoc.write(fos);
        }
    }

    private void copyHeader(XWPFDocument targetDoc, OutputData outputData) {
        for (XWPFParagraph paragraph : inputOutputParagraphs) {
            XWPFParagraph targetParagraph = targetDoc.createParagraph();
            XWPFRun run = targetParagraph.createRun();
            String headerStr = paragraph.getText();
            if (headerStr.contains("${unit}")) {
                headerStr = headerStr.replace("${unit}", outputData.getUnit());
            } else if (headerStr.contains("${bar_length}")) {
                headerStr = headerStr.replace("${bar_length}", String.valueOf(outputData.getBar_length()));
            } else if (headerStr.contains("${displayDividedBars}")) {
                headerStr = headerStr.replace("${displayDividedBars}", outputData.getDisplayDividedBars());
            } else if (headerStr.contains("${min_bars}")) {
                headerStr = headerStr.replace("${min_bars}", String.valueOf(outputData.getMin_bars()));
            }

            run.setText(headerStr);
            run.setStyle(paragraph.getStyle());
            if(paragraph.getRuns()!=null && paragraph.getRuns().size()>0) {
                run.setFontSize(paragraph.getRuns().get(0).getFontSize());
                run.setBold(paragraph.getRuns().get(0).isBold());
            }
            targetParagraph.getCTP().setPPr(paragraph.getCTP().getPPr());
        }
    }

    private void copyMethod(XWPFDocument targetDoc, int index, SplitMethod splitMethod) {
        for (XWPFParagraph headerParagraph : methodHeaderParagraphs) {
            XWPFParagraph targetParagraph = targetDoc.createParagraph();
            XWPFRun run = targetParagraph.createRun();
            String headerStr = headerParagraph.getText();
            headerStr = headerStr.replace("${index}", String.valueOf(index));
            run.setText(headerStr);
            run.setStyle(headerParagraph.getStyle());
            if(headerParagraph.getRuns()!=null && headerParagraph.getRuns().size()>0) {
                run.setFontSize(headerParagraph.getRuns().get(0).getFontSize());
                run.setBold(headerParagraph.getRuns().get(0).isBold());
            }
            targetParagraph.getCTP().setPPr(headerParagraph.getCTP().getPPr());
        }

        for (OutputSet outputSet : splitMethod.getSet()) {
            for (XWPFParagraph splitParagraph : methodSplitParagraphs) {
                XWPFParagraph targetParagraph = targetDoc.createParagraph();
                XWPFRun run = targetParagraph.createRun();
                String splitStr = splitParagraph.getText();
                splitStr = splitStr.replace("${total}", String.valueOf(outputSet.getTotal()));
                splitStr= splitStr.replace("${displaySplit}", outputSet.getDisplaySplit());
                run.setText("             \u2022", 0); // Dot character
                run.addTab();
                run.setText(splitStr);
                run.setStyle(splitParagraph.getStyle());
                if(splitParagraph.getRuns()!=null && splitParagraph.getRuns().size()>0) {
                    run.setFontSize(splitParagraph.getRuns().get(0).getFontSize());
                    run.setBold(splitParagraph.getRuns().get(0).isBold());
                }
                targetParagraph.getCTP().setPPr(splitParagraph.getCTP().getPPr());
            }
        }

        for (XWPFParagraph remainParagraph : methodRemainParagraphs) {
            XWPFParagraph targetParagraph = targetDoc.createParagraph();
            XWPFRun run = targetParagraph.createRun();
            String headerStr = remainParagraph.getText();
            headerStr= headerStr.replace("${displayRemain}", splitMethod.getDisplayRemain());
            run.setText(headerStr);
            run.setStyle(remainParagraph.getStyle());
            if(remainParagraph.getRuns()!=null && remainParagraph.getRuns().size()>0) {
                run.setFontSize(remainParagraph.getRuns().get(0).getFontSize());
                run.setBold(remainParagraph.getRuns().get(0).isBold());
            }
            targetParagraph.getCTP().setPPr(remainParagraph.getCTP().getPPr());
        }
    }

}
