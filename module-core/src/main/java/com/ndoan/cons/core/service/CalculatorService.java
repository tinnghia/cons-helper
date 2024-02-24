package com.ndoan.cons.core.service;

import freemarker.template.Configuration;

import com.ndoan.cons.core.dto.InputData;
import com.ndoan.cons.core.dto.OutputData;
import com.ndoan.cons.core.dto.OutputSet;
import com.ndoan.cons.core.dto.OutputSplit;
import freemarker.template.Template;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.io.*;
import java.util.*;

@Service
public class CalculatorService {
    @Autowired
    private Configuration freeMarkerConfig;
    public OutputData optimizeCut (InputData inputData) {
        System.out.println(generateDynamicContent());
        return sampleOutput();
    }

    private String html = "<div className='result-form'>\n" +
            "            <h2>Input</h2>\n" +
            "            <div className=\"indent\">\n" +
            "                <label>Don vi:</label> m\n" +
            "            </div>\n" +
            "            <div className=\"indent\">\n" +
            "                <label>Do dai cay:</label>\n" +
            "            </div>\n" +
            "            <div className=\"indent\">\n" +
            "                <label>Do dai moi doan:</label> 12.3, 14.5, 20.8, 45.6, 11.2\n" +
            "            </div>\n" +
            "\n" +
            "            <h2>Output</h2>\n" +
            "            <div className=\"indent\">\n" +
            "                <label>SO CAY TOI THIEU CAN DUNG:</label> 11\n" +
            "            </div>\n" +
            "            <div className=\"indent\">\n" +
            "                <label>CACH CHIA</label>\n" +
            "                <div className=\"indent\">\n" +
            "                    Cach 1\n" +
            "                    <ul className=\"indent\">\n" +
            "                        <li>5 * (Moi cay cho L1)</li>\n" +
            "                        <li>2 * (Moi cay cat thanh 3 * L2)</li>\n" +
            "                        <li>1 * (Moi cay cat thanh 1 * L2 , 2 L3)</li>\n" +
            "                        <li>2 * (Moi cay cat thanh 3 L3)</li>\n" +
            "                        <li>1 * (Moi cay cat thanh 1 L3)</li>\n" +
            "                    </ul>\n" +
            "                    <p> So doan thua: 3 * 1.2m , 12 * 2.1m</p>\n" +
            "                </div>\n" +
            "                <div className=\"indent\">\n" +
            "                    Cach 2\n" +
            "                    <ul className=\"indent\">\n" +
            "                        <li>5 * (Moi cay cho L1)</li>\n" +
            "                        <li>2 * (Moi cay cat thanh 3 * L2)</li>\n" +
            "                        <li>1 * (Moi cay cat thanh 1 * L2 , 2 L3)</li>\n" +
            "                        <li>1 * (Moi cay cat thanh 3 L3)</li>\n" +
            "                        <li>2 * (Moi cay cat thanh 2 L3)</li>\n" +
            "                    </ul>\n" +
            "                    <p> So doan thua: 3 * 1.2m , 12 * 2.1m</p>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            <div className=\"form-group\">\n" +
            "                <button type=\"submit\">Back</button>\n" +
            "            </div>\n" +
            "        </div>";

    private OutputData sampleOutput() {
        OutputData outputData = new OutputData();
        outputData.setMin_bars(11);
        outputData.setHtml(html);
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

    public String generateDynamicContent() {
        try {
            // Load FreeMarker template
            Template template = freeMarkerConfig.getTemplate("result-template.ftl");

            // Prepare data model
            Map<String, Object> data = new HashMap<>();
            data.put("message", "Hello, World!");


            XWPFDocument document = new XWPFDocument();

            // Create main document part
            XWPFDocument mainDocumentPart = document.getXWPFDocument();

            // Create a new paragraph
            XWPFParagraph paragraph = mainDocumentPart.createParagraph();

            // Create a run
            XWPFRun run = paragraph.createRun();


            FileOutputStream wordWriter = new FileOutputStream("/Users/nghiadoan/Development/Projects/result-doc.docx");


            // Process template and generate content
            StringWriter outStr = new StringWriter();
            template.process(data, outStr);

            run.setText(outStr.toString());
            document.write(wordWriter);
            wordWriter.close();

            String templatePath = "/Users/nghiadoan/Development/cons-helper/module-core/src/main/resources/templates/result-doc.docx";
            String outputPath = "/Users/nghiadoan/Development/cons-helper/module-core/src/main/resources/templates/result-doc-out.docx";
            HashMap<String,String> data1 = new HashMap<>();
            data1.put("bars", "11111");
            generateWordDoc(templatePath,outputPath,data1);
            getPar("/Users/nghiadoan/Development/cons-helper/module-core/src/main/resources/templates/method-doc.docx");
            return outStr.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating dynamic content";
        }
    }

        public static void generateWordDoc(String templatePath, String outputPath, Map<String, String> data) throws Exception {
            try (FileInputStream fis = new FileInputStream(templatePath);
                 FileOutputStream fos = new FileOutputStream(outputPath)) {

                XWPFDocument methodDoc = new XWPFDocument(new FileInputStream("/Users/nghiadoan/Development/cons-helper/module-core/src/main/resources/templates/method-doc.docx"));
                XWPFDocument doc = new XWPFDocument(fis);
                List<XWPFParagraph> paragraphs = doc.getParagraphs();

                for (XWPFParagraph paragraph : paragraphs) {
                    for (XWPFRun run : paragraph.getRuns()) {
                        String text = run.getText(0);
                        for (Map.Entry<String, String> entry : data.entrySet()) {
                            text = text.replace("${" + entry.getKey() + "}", entry.getValue());
                        }
                        run.setText(text, 0);
                    }
                }

                copyParagraphs(methodDoc, doc);
                copyParagraphs(methodDoc, doc);
                doc.write(fos);
                System.out.println("Word document generated successfully!");
            }
        }

    private static void copyParagraphs(XWPFDocument sourceDoc, XWPFDocument targetDoc) {
        List<XWPFParagraph> sourceParagraphs = sourceDoc.getParagraphs();
        for (XWPFParagraph sourceParagraph : sourceParagraphs) {
            XWPFParagraph targetParagraph = targetDoc.createParagraph();

            XWPFRun run = targetParagraph.createRun();
            System.out.println("Text = "  + sourceParagraph.getText());
            System.out.println("Style = "  + sourceParagraph.getStyle());
            run.setText(sourceParagraph.getText());
            run.setStyle(sourceParagraph.getStyle());

            targetParagraph.getCTP().setPPr(sourceParagraph.getCTP().getPPr());
        }
    }
    public static XWPFParagraph getPar(String templatePath) throws Exception {
        try (FileInputStream fis = new FileInputStream(templatePath)) {
            XWPFDocument doc = new XWPFDocument(fis);
            List<XWPFParagraph> paragraphs = doc.getParagraphs();
        System.out.println(paragraphs.get(0).getText());
            return paragraphs.get(0);
        }
    }

}
