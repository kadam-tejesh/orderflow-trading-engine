package com.orderflow.kafka_risk_service.disruptor;


import com.lmax.disruptor.RingBuffer;
import com.lmax.disruptor.dsl.Disruptor;

import com.orderflow.kafka_risk_service.order.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderPublisher {

    private final Disruptor<OrderEvent> disruptor;

    public void publish(Order order) {
        RingBuffer<OrderEvent> ringBuffer = disruptor.getRingBuffer();
        long sequence = ringBuffer.next();
        try {
            OrderEvent event = ringBuffer.get(sequence);
            event.setOrder(order);
        } finally {
            ringBuffer.publish(sequence);
        }
    }
}