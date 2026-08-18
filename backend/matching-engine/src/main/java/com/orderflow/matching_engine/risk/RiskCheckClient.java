package com.orderflow.matching_engine.risk;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

@Component
public class RiskCheckClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String RISK_SERVICE_URL = "http://localhost:8083/api/accounts";

    public boolean hasSufficientFunds(String accountId, BigDecimal orderValue) {
        String url = RISK_SERVICE_URL + "/" + accountId + "/check?orderValue=" + orderValue;
        try {
            Map<?, ?> response = restTemplate.getForObject(url, Map.class);
            return response != null && Boolean.TRUE.equals(response.get("sufficientFunds"));
        } catch (Exception e) {
            return false; // fail closed: reject if the risk service is unreachable
        }
    }
}
