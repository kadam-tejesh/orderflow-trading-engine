package com.orderflow.matching_engine.disruptor;

import com.orderflow.matching_engine.order.Order;

public class OrderEvent {
    private Order order;
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public static final com.lmax.disruptor.EventFactory<OrderEvent> FACTORY = OrderEvent::new;
}
