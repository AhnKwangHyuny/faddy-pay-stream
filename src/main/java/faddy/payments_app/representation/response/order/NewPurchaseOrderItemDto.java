package faddy.payments_app.representation.response.order;

import faddy.payments_app.domain.order.OrderItem;
import faddy.payments_app.domain.order.OrderStatus;
import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@Builder
public class NewPurchaseOrderItemDto {
//    private final int id;

    private final UUID orderId;

    private final int itemIdx;

    private final UUID productId;

    private final String productName;

    private final int price;

    private final String size;

    private final int amount;

    private final int quantity;

    private final OrderStatus itemStatus;

    public static List<NewPurchaseOrderItemDto> from(List<OrderItem> orderItems) {
        return orderItems.stream()
            .map(orderItem ->
                NewPurchaseOrderItemDto.builder()
                    .orderId(orderItem.getOrder().getOrderId())
                    .itemIdx(orderItem.getItemIdx())
                    .productName(orderItem.getProductName())
                    .price(orderItem.getPrice())
                    .size(orderItem.getSize())
                    .productId(orderItem.getProductId())
                    .amount(orderItem.getAmount())
                    .quantity(orderItem.getQuantity())
                    .itemStatus(orderItem.getState())
                    .build())
            .toList();
    }
}