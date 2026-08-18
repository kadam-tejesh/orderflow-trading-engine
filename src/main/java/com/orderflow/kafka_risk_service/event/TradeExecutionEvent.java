package com.orderflow.kafka_risk_service.event;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;





@Data
@NoArgsConstructor
@AllArgsConstructor
public class TradeExecutionEvent {
    private String tradeId;
    private String symbol;
    private String buyOrderId;
    private String sellOrderId;
    private BigDecimal price;
    private BigDecimal quantity;
    private Instant executedAt;
}