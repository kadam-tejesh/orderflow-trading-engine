package com.orderflow.matching_engine;

import com.orderflow.matching_engine.disruptor.OrderPublisher;
import com.orderflow.matching_engine.order.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

@SpringBootTest
class LatencyBenchmarkTest {

    @Autowired
    private OrderPublisher publisher;

    @Test
    void benchmarkThroughput() {
        int totalOrders = 100_000;
        long start = System.nanoTime();

        for (int i = 0; i < totalOrders; i++) {
            Order order = new Order();
            order.setAccountId("BENCH");
            order.setSymbol("AXLR");
            order.setSide(i % 2 == 0 ? Order.Side.BUY : Order.Side.SELL);
            order.setType(Order.OrderType.LIMIT);
            order.setPrice(BigDecimal.valueOf(100 + (i % 10)));
            order.setQuantity(BigDecimal.ONE);
            publisher.publish(order);
        }

        long elapsedMs = (System.nanoTime() - start) / 1_000_000;
        double ordersPerSec = totalOrders / (elapsedMs / 1000.0);
        System.out.printf("Processed %d orders in %dms (%.0f orders/sec)%n", totalOrders, elapsedMs, ordersPerSec);
    }
}
