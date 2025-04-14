package faddy.payments_app.application.service;

import faddy.payments_app.application.port.In.PaymentCancelUseCase;
import faddy.payments_app.application.port.out.api.PaymentAPIs;
import faddy.payments_app.application.port.out.repository.PaymentLedgerRepository;
import faddy.payments_app.domain.order.Order;
import faddy.payments_app.domain.payment.PaymentLedger;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentCancel;
import faddy.payments_app.representation.request.order.CancelOrder;
import faddy.payments_app.representation.request.payment.PaymentCancel;
import jakarta.transaction.Transactional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j
public class CancelService implements PaymentCancelUseCase {

    private final PaymentAPIs tossPayment;
    private final OrderService orderService;
    private final PaymentService paymentService;
    private final PaymentLedgerRepository paymentLedgerRepository;

    @Transactional
    @Override
    public boolean paymentCancel(CancelOrder cancelOrder) throws Exception {
        String paymentKey = cancelOrder.getPaymentKey();
        int cancellationAmount = cancelOrder.getCancellationAmount();
        UUID orderId = cancelOrder.getOrderId();
        
        // 상세 로깅 추가
        log.info("===== 주문 취소 처리 시작 =====");
        log.info("주문 ID: {}", orderId);
        log.info("결제 키: {}", paymentKey);
        log.info("취소 금액: {}", cancellationAmount);
        log.info("취소 사유: {}", cancelOrder.getCancelReason());
        log.info("취소 항목: {}", cancelOrder.hasItemIdx() ? 
            "부분 취소 (" + java.util.Arrays.toString(cancelOrder.getItemIdxs()) + ")" : "전체 취소");
        
        try {
            // 1. 주문 조회
            log.info("주문 정보 조회 중...");
            Order wantedCancelOrder = null;
            
            try {
                wantedCancelOrder = orderService.getOrderById(orderId);
                if (wantedCancelOrder == null) {
                    log.error("주문 정보를 찾을 수 없음 - orderId: {}", orderId);
                    throw new IllegalArgumentException("존재하지 않는 주문입니다: " + orderId);
                }
                log.info("주문 조회 성공 - 주문상태: {}, 총금액: {}, 결제ID: {}", 
                        wantedCancelOrder.getStatus(), wantedCancelOrder.getTotalPrice(), wantedCancelOrder.getPaymentId());
            } catch (Exception e) {
                log.error("주문 조회 실패: {}", e.getMessage());
                throw new IllegalArgumentException("주문 조회 중 오류가 발생했습니다: " + e.getMessage());
            }
            
            // 2. 결제 정보 조회
            log.info("결제 정보 조회 중...");
            PaymentLedger paymentInfo = null;
            
            try {
                paymentInfo = paymentService.getLatestPaymentInfoOnlyOne(paymentKey);
                if (paymentInfo == null) {
                    log.error("결제 정보를 찾을 수 없음 - paymentKey: {}", paymentKey);
                    throw new IllegalArgumentException("존재하지 않는 결제 정보입니다: " + paymentKey);
                }
                log.info("결제 정보 조회 성공 - 결제상태: {}, 원 결제금액: {}, 잔액: {}", 
                        paymentInfo.getPaymentStatus(), paymentInfo.getTotalAmount(), paymentInfo.getBalanceAmount());
            } catch (Exception e) {
                log.error("결제 정보 조회 실패: {}", e.getMessage());
                throw new IllegalArgumentException("결제 정보 조회 중 오류가 발생했습니다: " + e.getMessage());
            }
            
            // 3. 취소 가능 여부 확인
            log.info("취소 가능 여부 확인 중...");
            
            // 주문 상태 확인
            if (!wantedCancelOrder.isNotOrderStatusPurchaseDecision()) {
                log.error("주문 상태가 취소 가능한 상태가 아님 - 상태: {}", wantedCancelOrder.getStatus());
                throw new IllegalStateException("주문 상태가 취소 가능한 상태가 아닙니다: " + wantedCancelOrder.getStatus());
            }
            
            // 결제키와 주문의 결제 ID가 일치하는지 확인
            if (wantedCancelOrder.getPaymentId() != null && !wantedCancelOrder.getPaymentId().equals(paymentKey)) {
                log.error("주문의 결제 키와 요청�� 결제 키가 일치하지 않음 - 주문결제키: {}, 요청결제키: {}", 
                        wantedCancelOrder.getPaymentId(), paymentKey);
                throw new IllegalArgumentException("주문의 결제 정보와 요청한 결제 정보가 일치하지 않습니다");
            }
            
            // 취소 가능 금액 확인
            if (!paymentInfo.isCancellableAmountGreaterThan(cancellationAmount)) {
                log.error("취소 가능 금액 부족 - 요청: {}, 가능: {}", 
                        cancellationAmount, paymentInfo.getBalanceAmount());
                throw new IllegalStateException("취소 가능 금액이 부족합니다. 취소 가능 금액: " + paymentInfo.getBalanceAmount());
            }
            
            // 4. 토스페이먼츠 취소 API 호출
            log.info("토스페이먼츠 취소 API 호출 중...");
            ResponsePaymentCancel response = null;
            
            try {
                response = tossPayment.requestPaymentCancel(
                        paymentKey, 
                        new PaymentCancel(cancelOrder.getCancelReason(), cancellationAmount)
                );
                log.info("토스페이먼츠 취소 API 응답 성공 - 상태: {}, 잔액: {}", 
                        response.getStatus(), response.getBalanceAmount());
            } catch (Exception e) {
                log.error("토스페이먼츠 취소 API 호출 실패: {}", e.getMessage());
                throw new Exception("결제 취소 처리 중 오류가 발생했습니다: " + e.getMessage());
            }
            
            // 5. 취소 정보 저장
            log.info("취소 정보 DB에 저장 중...");
            try {
                paymentLedgerRepository.save(response.toEntity());
                log.info("취소 정보 저장 완료");
            } catch (Exception e) {
                log.error("취소 정보 저장 실패: {}", e.getMessage());
                throw new Exception("취소 정보 저장 중 오류가 발생했습니다: " + e.getMessage());
            }
            
            // 6. 주문 상태 업데이트
            log.info("주문 상태 업데이트 중...");
            try {
                if (cancelOrder.hasItemIdx()) {
                    log.info("선택 상품 취소 처리 - 항목 수: {}", cancelOrder.getItemIdxs().length);
                    wantedCancelOrder.orderCancel(cancelOrder.getItemIdxs());
                } else {
                    log.info("전체 주문 취소 처리");
                    wantedCancelOrder.orderAllCancel();
                }
                log.info("주문 상태 업데이트 완료");
            } catch (Exception e) {
                log.error("주문 상태 업데이트 실패: {}", e.getMessage());
                throw new Exception("주문 상태 업데이트 중 오류가 발생했습니다: " + e.getMessage());
            }
            
            log.info("===== 주문 취소 처리 완료 =====");
            return true;
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("비즈니스 로직 오류: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("취소 처리 중 예외 발생: {}", e.getMessage(), e);
            throw new Exception("주문 취소 처리 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }
}