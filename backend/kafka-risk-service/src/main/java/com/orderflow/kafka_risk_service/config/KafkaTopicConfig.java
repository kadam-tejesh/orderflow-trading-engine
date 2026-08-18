package com.orderflow.kafka_risk_service.config;


import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Value("${orderflow.kafka.topic.trade-executions}")
    private String tradeExecutionsTopic;

    @Value("${orderflow.kafka.topic.order-book-updates}")
    private String orderBookUpdatesTopic;

    @Bean
    public NewTopic tradeExecutionsTopic() {
        return TopicBuilder.name(tradeExecutionsTopic)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic orderBookUpdatesTopic() {
        return TopicBuilder.name(orderBookUpdatesTopic)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
