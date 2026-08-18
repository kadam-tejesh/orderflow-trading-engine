package com.orderflow.matching_engine.disruptor;

import com.lmax.disruptor.RingBuffer;
import com.lmax.disruptor.dsl.Disruptor;
import com.orderflow.matching_engine.order.Order;
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
            ringBuffer.get(sequence).setOrder(order);
        } finally {
            ringBuffer.publish(sequence);
        }
    }
}
