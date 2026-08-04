package com.orderflow.kafka_risk_service.risk;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class RiskService {

    private final AccountRepository accountRepository;

    public Account createOrUpdateAccount(String accountId, BigDecimal balance) {
        Account account = new Account(accountId, balance);
        return accountRepository.save(account);
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account getAccount(String accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new NoSuchElementException("Account not found: " + accountId));
    }

    /**
     * Core risk check (used fully from Week 4 onward): does this account
     * have enough simulated funds to cover the order value?
     */
    public boolean hasSufficientFunds(String accountId, BigDecimal orderValue) {
        Account account = getAccount(accountId);
        return account.getBalance().compareTo(orderValue) >= 0;
    }
}
