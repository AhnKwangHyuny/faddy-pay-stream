package faddy.payments_app.domain.order;


import faddy.payments_app.domain.common.TimeBaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "purchase_order")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class Order extends TimeBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "order_id", columnDefinition = "BINARY(16)")
    private UUID orderId;

    private String name;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "total_price")
    private int totalPrice;

    @Column(name = "order_state")
    @Convert(converter = OrderStatusConverter.class)
    private OrderStatus status;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    /**
     * Order Entity Business logic
     * */

    @Builder
    public Order(String name, String phoneNumber, List<OrderItem> items) throws Exception {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.status = OrderStatus.ORDER_COMPLETED;
        this.items = items;
    }

    public static UUID generateOrderId() {
        return UUID.randomUUID();
    }

    public void orderPaymentFullFill(String paymentKey) {
        update(OrderStatus.PAYMENT_FULLFILL);
        this.paymentId = paymentKey;
    }

    public void orderAllCancel() {
        items.forEach(item -> item.update(OrderStatus.ORDER_CANCELLED));
        update(OrderStatus.ORDER_CANCELLED);
    }

    public void orderCancel(int[] itemIdxs) {
        for(int itemIdx : itemIdxs){
            orderCancelBy(itemIdx);
        }
    }

    private void orderCancelBy(int itemIdx) {
        this.items.stream().filter(orderItem -> orderItem.getItemIdx() == itemIdx)
            .forEach(item -> item.update(OrderStatus.ORDER_CANCELLED));
    }

    public static boolean verifyHaveAtLeastOneItem(List<OrderItem> items) {
        //Test#1, Test#2, Test#3
        return items == null || items.isEmpty();
    }

    public boolean verifyNoDuplicateOrderItemId() {
        List<UUID> allIds = this.items.stream().map(OrderItem::getProductId).toList();
        List<UUID> distinctIds = allIds.stream().distinct().toList();

        if(allIds.size() == distinctIds.size())
            return true;
        else
            throw new IllegalArgumentException("There are duplicate order item ids");
    }

    public boolean isNotOrderStatusPurchaseDecision() {
        return !(this.status.equals(OrderStatus.PURCHASE_DECISION));
    }


    private Order update(OrderStatus status) {
        this.status = status;
        this.getItems().forEach(item -> item.update(status));
        return this;
    }

    public void calculateTotalAmount() {
        this.totalPrice = this.items.stream().map(OrderItem::calculateAmount).reduce(0, Integer::sum);
    }

    @Override
    public String toString() {
        return "Order{" +
            ", name='" + name + '\'' +
            ", phoneNumber='" + phoneNumber + '\'' +
            ", paymentId='" + paymentId + '\'' +
            ", totalPrice=" + totalPrice +
            ", status=" + status +
            ", items=" + items +
            '}';
    }
}