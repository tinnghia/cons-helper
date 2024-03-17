package com.ndoan.cons.core.service;

import com.ndoan.cons.core.algo.DesignBeam;
import com.ndoan.cons.core.model.BeamInputData;
import com.ndoan.cons.core.model.BeamOutputData;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;

@Service
public class BeamDesignService implements InitializingBean {

    DesignBeam designBeam;
    @Override
    public void afterPropertiesSet() throws Exception {
        designBeam = new DesignBeam();
    }

    public BeamOutputData design(BeamInputData inputData) {
        return designBeam.design(inputData);
    }


}
