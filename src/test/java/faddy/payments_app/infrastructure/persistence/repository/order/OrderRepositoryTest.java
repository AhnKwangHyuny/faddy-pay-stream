package faddy.payments_app.infrastructure.persistence.repository.order;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import faddy.payments_app.application.port.out.repository.OrderRepository;
import faddy.payments_app.domain.order.Order;
import faddy.payments_app.domain.order.OrderItem;
import faddy.payments_app.domain.order.OrderStatus;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@DataJpaTest(includeFilters = @ComponentScan.Filter(
    type = FilterType.ASSIGNABLE_TYPE,
    classes = OrderRepositoryImpl.class
))
@AutoConfigureTestDatabase(replace = Replace.ANY)
public class OrderRepositoryTest {

    @Autowired
    private OrderRepository orderRepository;

    /**
     * 주문 저장 및 ID로 조회 테스트
     */
    @Test
    @DisplayName("주문을 저장하고 ID로 조회할 수 있다")
    public void testSaveAndFindById() {
        // Given
        List<OrderItem> items = new ArrayList<>();
        Order order = null;
        try {
            order = Order.builder()
                .name("Test Customer")
                .phoneNumber("01012345678")
                .items(items)
                .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create test order", e);
        }

        // When
        Order savedOrder = orderRepository.save(order);
        Order foundOrder = orderRepository.findById(savedOrder.getOrderId());

        // Then
        assertThat(foundOrder).isNotNull();
        assertThat(foundOrder.getOrderId()).isNotNull();
        assertThat(foundOrder.getName()).isEqualTo("Test Customer");
        assertThat(foundOrder.getPhoneNumber()).isEqualTo("01012345678");
        assertThat(foundOrder.getStatus()).isEqualTo(OrderStatus.ORDER_COMPLETED);
    }

    /**
     * 존재하지 않는 ID 조회 시 예외 발생 테스트
     */
//    @Test
    @DisplayName("존재하지 않는 ID로 조회시 예외가 발생한다")
    public void testFindByIdNotFound() {
        // Given
        UUID nonExistentId = UUID.randomUUID();

        // When & Then
        assertThrows(NoSuchElementException.class,
            () -> orderRepository.findById(nonExistentId),
            "존재하지 않는 ID로 조회시 NoSuchElementException이 발생해야 합니다");
    }

//    @Test
    @DisplayName("주문을 삭제할 수 있다")
    public void testRemoveAll() {
        // Given
        List<OrderItem> items = new ArrayList<>();
        Order order = null;
        try {
            order = Order.builder()
                .name("Test Customer")
                .phoneNumber("01012345678")
                .items(items)
                .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create test order", e);
        }
        Order savedOrder = orderRepository.save(order);
        UUID orderId = savedOrder.getOrderId();

        // When
        orderRepository.removeAll(orderId); // 반환값 사용 안 함

        // Then
        // 삭제됐는지 확인만 하면 됨
        assertThrows(NoSuchElementException.class,
            () -> orderRepository.findById(orderId),
            "삭제된 주문은 조회시 NoSuchElementException이 발생해야 합니다");
    }

    /**
     * 주문 결제 완료 처리 테스트
     */
    @Test
    @DisplayName("주문의 결제 완료 처리를 할 수 있다")
    public void testOrderPaymentFullFill() {
        // Given
        List<OrderItem> items = new ArrayList<>();
        Order order = null;
        try {
            order = Order.builder()
                .name("Test Customer")
                .phoneNumber("01012345678")
                .items(items)
                .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create test order", e);
        }
        Order savedOrder = orderRepository.save(order);
        String paymentKey = "payment-key-" + UUID.randomUUID().toString();

        // When
        savedOrder.orderPaymentFullFill(paymentKey);
        Order updatedOrder = orderRepository.save(savedOrder);
        Order foundOrder = orderRepository.findById(updatedOrder.getOrderId());

        // Then
        assertThat(foundOrder).isNotNull();
        assertThat(foundOrder.getStatus()).isEqualTo(OrderStatus.PAYMENT_FULLFILL);
        assertThat(foundOrder.getPaymentId()).isEqualTo(paymentKey);
    }
}