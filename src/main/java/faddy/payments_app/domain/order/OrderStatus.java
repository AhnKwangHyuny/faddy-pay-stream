package faddy.payments_app.domain.order;

import lombok.Getter;

/**
 * 주문 상태 코드
 * - ORDER_COMPLETED(01): 주문이 완료된 상태, 결제 전 단계
 * - ORDER_CANCELLED(02): 주문이 취소된 상태
 * - PAYMENT_FULLFILL(03): 결제가 완료되어 주문이 확정된 상태
 * - SHIPPING_PREPARE(04): 배송 준비 중인 상태, 상품 포장 및 출고 준비가 진행
 * - SHIPPING(05): 배송 중인 상태, 물품이 고객에게 배송되는 중
 * - SHIPPING_COMPLETED(06): 배송이 완료된 상태 고객에게 상품이 전달
 * - PURCHASE_DECISION(07): 구매 결정 상태. 고객이 최종 구매 확정 전 상태
 */

@Getter
public enum OrderStatus {
    ORDER_COMPLETED("01"),
    ORDER_CANCELLED("02"),
    PAYMENT_FULLFILL("03"),
    SHIPPING_PREPARE("04"),
    SHIPPING("05"),
    SHIPPING_COMPLETED("06"),
    PURCHASE_DECISION("07");

    private final String code;

    OrderStatus(String c) {
        code = c;
    }
}
