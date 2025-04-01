package faddy.payments_app.domain.order;


import faddy.payments_app.domain.common.TimeBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem extends TimeBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "item_idx")
    private int itemIdx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "product_price")
    private int price;

    @Column(name = "product_size")
    private String size;

    private int amount;

    private int quantity;

    @Column(name = "order_state")
    @Convert(converter = OrderStatusConverter.class)
    private OrderStatus state;

    public void update(OrderStatus state) {
        this.state = state;
    }

    public int calculateAmount() {
        int totalPrice = price * quantity;
        this.amount = totalPrice;
        return totalPrice;
    }
}
