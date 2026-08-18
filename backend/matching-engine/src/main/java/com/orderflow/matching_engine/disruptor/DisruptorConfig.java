package com.orderflow.matching_engine.disruptor;

import com.lmax.disruptor.BlockingWaitStrategy;
import com.lmax.disruptor.dsl.Disruptor;
import com.lmax.disruptor.dsl.ProducerType;
import com.orderflow.matching_engine.event.TradeExecutionEvent;
import com.orderflow.matching_engine.order.OrderBook;
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
        return new OrderBook(trade -> kafkaTemplate.send(tradeExecutionsTopic, trade.getSymbol(), trade));
    }

    @Bean
    public Disruptor<OrderEvent> disruptor(OrderBook orderBook) {
        ThreadFactory threadFactory = Executors.defaultThreadFactory();
        Disruptor<OrderEvent> disruptor = new Disruptor<>(
                OrderEvent.FACTORY, 16384, threadFactory, ProducerType.SINGLE, new BlockingWaitStrategy()
        );
        disruptor.handleEventsWith((event, sequence, endOfBatch) -> orderBook.submit(event.getOrder()));
        disruptor.start();
        return disruptor;
    }
}
