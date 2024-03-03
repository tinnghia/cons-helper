package com.ndoan.cons.core.cache;

import com.ndoan.cons.core.dto.OutputData;

import java.util.HashMap;
import java.util.Map;

public class CacheManager {
    private final Map<String, OutputData> cache;
    private static CacheManager _instance;

    private CacheManager() {
        cache = new HashMap<>();
    }

    public static CacheManager getInstance() {
        if (_instance == null)
            _instance = new CacheManager();
        return _instance;
    }

    public void put(String workId, OutputData data) {
        cache.put(workId, data);
    }

    public OutputData get(String workId) {
        return cache.get(workId);
    }

}
