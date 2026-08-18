package com.orderflow.kafka_risk_service.order;




import com.orderflow.kafka_risk_service.event.TradeExecutionEvent;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.function.Consumer;

@Slf4j
public class OrderBook {

    // Bids: highest price first. Asks: lowest price first.
    private final TreeMap<BigDecimal, Deque<Order>> bids = new TreeMap<>(Comparator.reverseOrder());
    private final TreeMap<BigDecimal, Deque<Order>> asks = new TreeMap<>();

    private final Consumer<TradeExecutionEvent> onTrade;

    public OrderBook(Consumer<TradeExecutionEvent> onTrade) {
        this.onTrade = onTrade;
    }

    /** Adds the order to the book and immediately attempts to match it. */
    public void submit(Order order) {
        if (order.getSide() == Order.Side.BUY) {
            match(order, asks, bids);
        } else {
            match(order, bids, asks);
        }
    }

    private void match(Order incoming, TreeMap<BigDecimal, Deque<Order>> opposite, TreeMap<BigDecimal, Deque<Order>> same) {
        BigDecimal remaining = incoming.getQuantity();

        while (remaining.signum() > 0 && !opposite.isEmpty()) {
            Map.Entry<BigDecimal, Deque<Order>> best = opposite.firstEntry();
            BigDecimal bestPrice = best.getKey();

            boolean priceCrosses = incoming.getType() == Order.OrderType.MARKET
                    || (incoming.getSide() == Order.Side.BUY && incoming.getPrice().compareTo(bestPrice) >= 0)
                    || (incoming.getSide() == Order.Side.SELL && incoming.getPrice().compareTo(bestPrice) <= 0);

            if (!priceCrosses) break;

            Deque<Order> level = best.getValue();
            Order resting = level.peekFirst();
            BigDecimal tradeQty = remaining.min(resting.getQuantity());

            // Emit the trade
            TradeExecutionEvent trade = new TradeExecutionEvent(
                    UUID.randomUUID().toString(),
                    incoming.getSymbol(),
                    incoming.getSide() == Order.Side.BUY ? incoming.getOrderId() : resting.getOrderId(),
                    incoming.getSide() == Order.Side.SELL ? incoming.getOrderId() : resting.getOrderId(),
                    bestPrice,
                    tradeQty,
                    Instant.now()
            );
            onTrade.accept(trade);

            remaining = remaining.subtract(tradeQty);
            resting.setQuantity(resting.getQuantity().subtract(tradeQty));

            if (resting.getQuantity().signum() == 0) {
                level.pollFirst();
                if (level.isEmpty()) opposite.remove(bestPrice);
            }
        }

        // Any unfilled remainder of a LIMIT order rests on the book
        if (remaining.signum() > 0 && incoming.getType() == Order.OrderType.LIMIT) {
            incoming.setQuantity(remaining);
            same.computeIfAbsent(incoming.getPrice(), k -> new ArrayDeque<>()).addLast(incoming);
        }
    }

    /** Level 2 depth: aggregated volume at each price level, top N levels. */
    public List<DepthLevel> bidDepth(int levels) {
        return aggregate(bids, levels);
    }

    public List<DepthLevel> askDepth(int levels) {
        return aggregate(asks, levels);
    }

    private List<DepthLevel> aggregate(TreeMap<BigDecimal, Deque<Order>> side, int levels) {
        List<DepthLevel> result = new ArrayList<>();
        for (var entry : side.entrySet()) {
            if (result.size() >= levels) break;
            BigDecimal totalVolume = entry.getValue().stream()
                    .map(Order::getQuantity)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            result.add(new DepthLevel(entry.getKey(), totalVolume));
        }
        return result;
    }

    public record DepthLevel(BigDecimal price, BigDecimal volume) {}
}
