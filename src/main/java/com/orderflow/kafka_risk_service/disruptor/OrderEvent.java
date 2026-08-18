package com.orderflow.kafka_risk_service.disruptor;


import com.orderflow.kafka_risk_service.order.Order;
import lombok.Data;

@Data
public class OrderEvent {
    private Order order;

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public static final com.lmax.disruptor.EventFactory<OrderEvent> FACTORY = OrderEvent::new;
}
