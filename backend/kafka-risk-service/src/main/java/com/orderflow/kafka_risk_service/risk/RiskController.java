package com.orderflow.kafka_risk_service.risk;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class RiskController {

    private final RiskService riskService;

    @PostMapping
    public Account createAccount(@RequestBody Map<String, Object> body) {
        String accountId = (String) body.get("accountId");
        BigDecimal balance = new BigDecimal(body.get("balance").toString());
        return riskService.createOrUpdateAccount(accountId, balance);
    }

    @GetMapping
    public List<Account> getAllAccounts() {
        return riskService.getAllAccounts();
    }

    @GetMapping("/{accountId}")
    public Account getAccount(@PathVariable String accountId) {
        return riskService.getAccount(accountId);
    }

    @GetMapping("/{accountId}/check")
    public Map<String, Object> checkFunds(@PathVariable String accountId, @RequestParam BigDecimal orderValue) {
        boolean sufficient = riskService.hasSufficientFunds(accountId, orderValue);
        return Map.of(
                "accountId", accountId,
                "orderValue", orderValue,
                "sufficientFunds", sufficient
        );
    }
}
