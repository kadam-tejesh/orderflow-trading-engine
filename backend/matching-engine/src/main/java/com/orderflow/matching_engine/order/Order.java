package com.orderflow.matching_engine.order;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;

@Data
public class Order {
    private String orderId;
    private String accountId;
    private String symbol;
    private Side side;
    private OrderType type;
    private BigDecimal price;
    private BigDecimal quantity;
    private Instant timestamp;

    public enum Side { BUY, SELL }
    public enum OrderType { LIMIT, MARKET }
}
