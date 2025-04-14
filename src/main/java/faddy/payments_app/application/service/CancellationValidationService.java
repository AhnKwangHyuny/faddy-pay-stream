package faddy.payments_app.application.service;

import faddy.payments_app.domain.order.Order;
import faddy.payments_app.domain.payment.PaymentLedger;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CancellationValidationService {
    public void validateCancellation(Order wantedCancelOrder, PaymentLedger paymentInfo, int cancellationAmount, String paymentKey) {
        // 주문 상태 확인
        if (!wantedCancelOrder.isNotOrderStatusPurchaseDecision()) {
            throw new IllegalStateException("주문 상태가 취소 가능한 상태가 아닙니다: " + wantedCancelOrder.getStatus());
        }

        // 결제 키와 주문의 결제 ID가 일치하는지 확인
        if (wantedCancelOrder.getPaymentId() != null && !wantedCancelOrder.getPaymentId().equals(paymentKey)) {
            throw new IllegalArgumentException("주문의 결제 정보와 요청한 결제 정보가 일치하지 않습니다");
        }

        // 취소 가능 금액 확인
        if (!paymentInfo.isCancellableAmountGreaterThan(cancellationAmount)) {
            throw new IllegalStateException("취소 가능 금액이 부족합니다. 취소 가능 금액: " + paymentInfo.getBalanceAmount());
        }
    }
}
