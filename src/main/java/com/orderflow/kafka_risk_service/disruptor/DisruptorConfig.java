package com.orderflow.kafka_risk_service.disruptor;



import com.lmax.disruptor.BlockingWaitStrategy;
import com.lmax.disruptor.dsl.Disruptor;
import com.lmax.disruptor.dsl.ProducerType;

import com.orderflow.kafka_risk_service.event.TradeExecutionEvent;
import com.orderflow.kafka_risk_service.order.OrderBook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;

@Configuration
public class DisruptorConfig {

    @Value("${orderflow.kafka.topic.trade-executions}")
    private String tradeExecutionsTopic;

    @Bean
    public OrderBook orderBook(KafkaTemplate<String, TradeExecutionEvent> kafkaTemplate) {
        // Every matched trade gets published to Kafka so Risk Management
        // and the Market Data Gateway can consume it.
        return new OrderBook(trade -> kafkaTemplate.send(tradeExecutionsTopic, trade.getSymbol(), trade));
    }

    @Bean
    public Disruptor<OrderEvent> disruptor(OrderBook orderBook) {
        ThreadFactory threadFactory = Executors.defaultThreadFactory();

        // Ring buffer size must be a power of 2. 1024 * 16 gives plenty of
        // headroom for 100k orders/sec bursts without blocking producers.
        Disruptor<OrderEvent> disruptor = new Disruptor<>(
                OrderEvent.FACTORY,
                16384,
                threadFactory,
                ProducerType.SINGLE,       // single producer = fastest, no CAS contention
                new BlockingWaitStrategy()
        );

        disruptor.handleEventsWith((event, sequence, endOfBatch) -> orderBook.submit(event.getOrder()));
        disruptor.start();
        return disruptor;
    }
}