package faddy.payments_app.application.service;

import faddy.payments_app.application.port.In.PaymentCancelUseCase;
import faddy.payments_app.application.port.out.api.PaymentAPIs;
import faddy.payments_app.application.port.out.repository.PaymentLedgerRepository;
import faddy.payments_app.domain.order.Order;
import faddy.payments_app.domain.payment.PaymentLedger;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentCancel;
import faddy.payments_app.representation.request.order.CancelOrder;
import faddy.payments_app.representation.request.payment.PaymentCancel;
import faddy.payments_app.representation.response.payment.CancelPaymentResponseDto;
import jakarta.transaction.Transactional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j
public class CancelService implements PaymentCancelUseCase {

    private final OrderService orderService;
    private final PaymentService paymentService;
    private final CancellationValidationService cancellationValidationService;
    private final PaymentCancelApiService paymentCancelApiService;
    private final PaymentLedgerRepository paymentLedgerRepository;
    private final OrderStatusUpdateService orderStatusUpdateService;

    @Transactional
    @Override
    public CancelPaymentResponseDto paymentCancel(CancelOrder cancelOrder) throws Exception {
        String paymentKey = cancelOrder.getPaymentKey();
        int cancellationAmount = cancelOrder.getCancellationAmount();
        UUID orderId = cancelOrder.getOrderId();

        log.info("===== 주문 취소 처리 시작 =====");
        log.info("주문 ID: {}", orderId);
        log.info("결제 키: {}", paymentKey);
        log.info("취소 금액: {}", cancellationAmount);
        log.info("취소 사유: {}", cancelOrder.getCancelReason());

        try {
            // 1. 주문 조회
            Order wantedCancelOrder = orderService.getOrderById(orderId);

            // 2. 결제 정보 조회
            PaymentLedger paymentInfo = paymentService.getLatestPaymentInfoOnlyOne(paymentKey);

            // 3. 취소 가능 여부 확인
            cancellationValidationService.validateCancellation(wantedCancelOrder, paymentInfo, cancellationAmount, paymentKey);

            // 4. 토스페이먼츠 취소 API 호출
            ResponsePaymentCancel response = paymentCancelApiService.cancelPayment(paymentKey, cancelOrder);

            // 5. 취소 정보 저장
            paymentLedgerRepository.save(response.toEntity());

            // 6. 주문 상태 업데이트
            orderStatusUpdateService.updateOrderStatus(wantedCancelOrder, cancelOrder);

            log.info("===== 주문 취소 처리 완료 =====");
            return CancelPaymentResponseDto.success();
        } catch (Exception e) {
            log.error("취소 처리 중 예외 발생: {}", e.getMessage(), e);
            return CancelPaymentResponseDto.fail("주문 취소 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
