package faddy.payments_app.domain.order;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class OrderEntityTests {

    @Test
    @DisplayName("주문 객체 생성 테스트")
    public void given_validOrderData_when_createOrder_then_returnOrderWithCorrectProperties() throws Exception {
        // Given
        String name = "홍길동";
        String phoneNumber = "010-1234-5678";
        List<OrderItem> items = Arrays.asList(
            createOrderItem(1, UUID.randomUUID(), "테스트 상품 1", 10000, 2),
            createOrderItem(2, UUID.randomUUID(), "테스트 상품 2", 5000, 1)
        );

        // When
        Order order = Order.builder()
            .name(name)
            .phoneNumber(phoneNumber)
            .items(items)
            .build();

        // Then
        assertEquals(name, order.getName());
        assertEquals(phoneNumber, order.getPhoneNumber());
        assertEquals(OrderStatus.ORDER_COMPLETED, order.getStatus());
        assertEquals(2, order.getItems().size());
    }

    @Test
    @DisplayName("주문 ID 생성 테스트")
    public void given_nothing_when_generateOrderId_then_returnUniqueUUID() {
        // Given & When
        UUID orderId1 = Order.generateOrderId();
        UUID orderId2 = Order.generateOrderId();

        // Then
        assertNotNull(orderId1);
        assertNotNull(orderId2);
        assertNotEquals(orderId1, orderId2);
    }

    @Test
    @DisplayName("결제 완료 처리 테스트")
    public void given_orderAndPaymentKey_when_orderPaymentFullFill_then_updateStatusAndPaymentId() throws Exception {
        // Given
        Order order = createSampleOrder();
        String paymentKey = "payment_key_12345";

        // When
        order.orderPaymentFullFill(paymentKey);

        // Then
        assertEquals(OrderStatus.PAYMENT_FULLFILL, order.getStatus());
        assertEquals(paymentKey, order.getPaymentId());
        order.getItems().forEach(item -> assertEquals(OrderStatus.PAYMENT_FULLFILL, item.getState()));
    }

    @Test
    @DisplayName("주문 전체 취소 테스트")
    public void given_order_when_orderAllCancel_then_updateStatusToCancelled() throws Exception {
        // Given
        Order order = createSampleOrder();

        // When
        order.orderAllCancel();

        // Then
        assertEquals(OrderStatus.ORDER_CANCELLED, order.getStatus());
//        order.getItems().forEach(item -> assertEquals(OrderStatus.ORDER_CANCELLED, item.getStatus()));
    }

    @Test
    @DisplayName("주문 부분 취소 테스트")
    public void given_orderAndItemIndices_when_orderCancel_then_updateSpecificItemsStatusToCancelled() throws Exception {
        // Given
        Order order = createSampleOrder();
        int[] itemIdxs = {1};

        // When
        order.orderCancel(itemIdxs);

        // Then
        OrderItem item1 = order.getItems().stream()
            .filter(item -> item.getItemIdx() == 1)
            .findFirst()
            .orElseThrow();
        OrderItem item2 = order.getItems().stream()
            .filter(item -> item.getItemIdx() == 2)
            .findFirst()
            .orElseThrow();

//        assertEquals(OrderStatus.ORDER_CANCELLED, item1.getStatus());
//        assertEquals(OrderStatus.ORDER_COMPLETED, item2.getStatus());
    }

    @Test
    @DisplayName("최소 하나의 아이템 검증 테스트 - 빈 리스트일 경우 true 반환")
    public void given_emptyItemList_when_verifyHaveAtLeastOneItem_then_returnTrue() {
        // Given
        List<OrderItem> emptyList = Collections.emptyList();

        // When
        boolean result = Order.verifyHaveAtLeastOneItem(emptyList);

        // Then
        assertTrue(result);
    }

//    @Test
    @DisplayName("최소 하나의 아이템 검증 테스트 - null일 경우 true 반환")
    public void given_nullItemList_when_verifyHaveAtLeastOneItem_then_returnTrue() {
        // Given
        List<OrderItem> nullList = null;

        // When
        boolean result = Order.verifyHaveAtLeastOneItem(nullList);

        // Then
        assertTrue(result);
    }

//    @Test
    @DisplayName("최소 하나의 아이템 검증 테스트 - 아이템이 있을 경우 false 반환")
    public void given_nonEmptyItemList_when_verifyHaveAtLeastOneItem_then_returnFalse() throws Exception {
        // Given
        List<OrderItem> itemList = Arrays.asList(
            createOrderItem(1, UUID.randomUUID(), "테스트 상품", 10000, 1)
        );

        // When
        boolean result = Order.verifyHaveAtLeastOneItem(itemList);

        // Then
        assertFalse(result);
    }

//    @Test
    @DisplayName("상품 ID 중복 검증 테스트 - 중복 없는 경우 true 반환")
    public void given_orderWithUniqueProductIds_when_verifyDuplicateOrderItemId_then_returnTrue() throws Exception {
        // Given
        Order order = createSampleOrder();

        // When
        boolean result = order.verifyDuplicateOrderItemId();

        // Then
        assertTrue(result);
    }

//    @Test
    @DisplayName("상품 ID 중복 검증 테스트 - 빈 리스트일 경우 예외 발생")
    public void given_orderWithNoItems_when_verifyDuplicateOrderItemId_then_throwException() throws Exception {
        // Given
        Order order = Order.builder()
            .name("홍길동")
            .phoneNumber("010-1234-5678")
            .items(new ArrayList<>())
            .build();

        // When & Then
        assertThrows(IllegalArgumentException.class, order::verifyDuplicateOrderItemId);
    }

//    @Test
    @DisplayName("주문 상태 검증 테스트 - 구매 완료 상태가 아닌 경우 true 반환")
    public void given_orderNotInPurchaseDecisionStatus_when_isNotOrderStatusPurchaseDecision_then_returnTrue() throws Exception {
        // Given
        Order order = createSampleOrder(); // OrderStatus.ORDER_COMPLETED by default

        // When
        boolean result = order.isNotOrderStatusPurchaseDecision();

        // Then
        assertTrue(result);
    }

//    @Test
    @DisplayName("총 금액 계산 테스트")
    public void given_orderWithItems_when_calculateTotalAmount_then_sumItemAmounts() throws Exception {
        // Given
        Order order = createOrderWithItems(
            createOrderItem(1, UUID.randomUUID(), "테스트 상품 1", 10000, 2), // 20000원
            createOrderItem(2, UUID.randomUUID(), "테스트 상품 2", 5000, 1)   // 5000원
        );

        // When
        order.calculateTotalAmount();

        // Then
        assertEquals(25000, order.getTotalPrice());
    }

    // 도우미 메소드
    private Order createSampleOrder() throws Exception {
        return createOrderWithItems(
            createOrderItem(1, UUID.randomUUID(), "테스트 상품 1", 10000, 2),
            createOrderItem(2, UUID.randomUUID(), "테스트 상품 2", 5000, 1)
        );
    }

    private Order createOrderWithItems(OrderItem... items) throws Exception {
        return Order.builder()
            .name("홍길동")
            .phoneNumber("010-1234-5678")
            .items(Arrays.asList(items))
            .build();
    }

    private OrderItem createOrderItem(int itemIdx, UUID productId, String name, int price, int quantity) {
        return OrderItem.builder()
            .itemIdx(itemIdx)
            .productId(productId)
            .productName(name)
            .price(price)
            .quantity(quantity)
            .build();
    }
}