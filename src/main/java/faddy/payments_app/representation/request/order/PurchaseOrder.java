package faddy.payments_app.representation.request.order;

import faddy.payments_app.domain.order.Order;
import faddy.payments_app.domain.order.OrderItem;
import faddy.payments_app.domain.order.OrderStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder {
    @NotNull(message = "This Orderer is required")
    @Valid
    private Orderer orderer;

    @Size(min = 1)
    @Valid
    private List<PurchaseOrderItem> newlyOrderItem;


    public List<OrderItem> convertToOrderItems(Order order) {

        return newlyOrderItem.stream()
            .map(item -> convertToOrderItem(item , order))
            .toList();
    }


    public OrderItem convertToOrderItem(PurchaseOrderItem item , Order order) {
        return OrderItem.builder()
            .order(order)
            .itemIdx(item.getItemIdx())
            .productId(item.getProductId())
            .quantity(item.getQuantity())
            .productName(item.getProductName())
            .price(item.getPrice())
            .quantity(item.getAmounts())
            .size("FREE")
            .state(OrderStatus.ORDER_COMPLETED)
            .build();
    }

    public Order toEntity() throws Exception {
        Order o = Order.builder()
            .items(new ArrayList<>())
            .name(this.getOrderer().getName())
            .phoneNumber(this.getOrderer().getPhoneNumber())
            .build();

        o.getItems().addAll(convertToOrderItems(o));
        if(Order.verifyHaveAtLeastOneItem(o.getItems())) throw new Exception("아이템이 존재하지 않습니다.");

        o.verifyNoDuplicateOrderItemId();
        o.calculateTotalAmount();

        return o;
    }


}
