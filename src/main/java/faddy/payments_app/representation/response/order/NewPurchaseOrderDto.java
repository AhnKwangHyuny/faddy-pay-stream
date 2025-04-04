package faddy.payments_app.representation.response.order;

import faddy.payments_app.domain.order.Order;
import faddy.payments_app.domain.order.OrderItem;
import faddy.payments_app.domain.order.OrderStatus;
import faddy.payments_app.representation.request.order.Orderer;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Slf4j

public class NewPurchaseOrderDto {
    private final UUID orderId;

    private final Orderer orderer;

    private final String paymentId;

    private final int totalPrice;

    private final OrderStatus status;

    @Getter
    private List<NewPurchaseOrderItemDto> items = new ArrayList<>();

    private NewPurchaseOrderDto(UUID id, String name, String phoneNumber, String paymentId, int totalPrice, OrderStatus status, List<OrderItem> items) {
        this.orderId = id;
        this.orderer = new Orderer(name, phoneNumber);
        this.paymentId = paymentId;
        this.totalPrice = totalPrice;
        this.status = status;
        this.items = NewPurchaseOrderItemDto.from(items);
    }

    public static NewPurchaseOrderDto from(Order order) { //PurchaseOrderDto -> NewOrderDto
        log.info("orderItems -> {}", order.getItems());
        return new NewPurchaseOrderDto(order.getOrderId(), order.getName(), order.getPhoneNumber(), order.getPaymentId(), order.getTotalPrice(),
            order.getStatus(), order.getItems());
    }
}
