package com.ndoan.cons.core.service;

import com.ndoan.cons.core.algo.DesignBeam;
import com.ndoan.cons.core.model.BeamInputData;
import com.ndoan.cons.core.model.BeamListOutputData;
import com.ndoan.cons.core.model.BeamOutputData;
import com.ndoan.cons.core.model.MultiBeamListOutputData;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;

@Service
public class BeamDesignService implements InitializingBean {

    DesignBeam designBeam;

    @Override
    public void afterPropertiesSet() throws Exception {
        designBeam = new DesignBeam();
    }

    public BeamOutputData designSingle(BeamInputData inputData) {
        return designBeam.designSingle(inputData);
    }

    public BeamListOutputData design(BeamInputData[] inputDatas) {
        return designBeam.design(inputDatas);
    }

    public MultiBeamListOutputData designForMulti(BeamInputData[] inputDatas) {
        return designBeam.designForMulti(inputDatas);
    }


}
