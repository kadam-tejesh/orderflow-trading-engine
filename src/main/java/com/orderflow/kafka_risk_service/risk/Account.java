package com.orderflow.kafka_risk_service.risk;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Represents a simulated trading account with an available fund balance.
 * The Risk Management module checks this balance before allowing an
 * order into the Matching Engine (full check wired in Week 4).
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    private String accountId;

    @Column(nullable = false)
    private BigDecimal balance;
}
