package faddy.payments_app.application.service;

import faddy.payments_app.application.port.In.GetPaymentInfoUseCase;
import faddy.payments_app.application.port.In.PaymentFullfillUseCase;
import faddy.payments_app.application.port.out.api.PaymentAPIs;
import faddy.payments_app.application.port.out.repository.OrderRepository;
import faddy.payments_app.application.port.out.repository.PaymentLedgerRepository;
import faddy.payments_app.application.port.out.repository.TransactionTypeRepository;
import faddy.payments_app.domain.order.Order;
import faddy.payments_app.domain.order.OrderStatus;
import faddy.payments_app.domain.payment.PaymentLedger;
import faddy.payments_app.domain.payment.PaymentMethod;
import faddy.payments_app.domain.payment.TransactionType;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentApproved;
import faddy.payments_app.representation.request.payment.PaymentApproved;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
//@Transactional // 모듈 수준에서 격리
@RequiredArgsConstructor
@Slf4j
public class PaymentService implements PaymentFullfillUseCase, GetPaymentInfoUseCase {

    @Qualifier("tossPayment")
    private final PaymentAPIs tossPayment;
    private final OrderRepository orderRepository;
    private final PaymentLedgerRepository paymentLedgerRepository;
    private final Set<TransactionTypeRepository> transactionTypeRepositorySet;

    private final Map<String, TransactionTypeRepository> transactionTypeRepositories = new HashMap<>();
    private TransactionTypeRepository transactionTypeRepository;
    private final Map<String, Boolean> processedPayments = new ConcurrentHashMap<>();


    @PostConstruct
    public void init() {
        for (TransactionTypeRepository transactionTypeRepository : transactionTypeRepositorySet) {
            String paymentMethodType = transactionTypeRepository.getClass().getSimpleName()
                .split("TransactionTypeRepository")[0].toLowerCase();

            transactionTypeRepositories.put(paymentMethodType, transactionTypeRepository);
        }
    }

    @Transactional
    @Override
    public List<PaymentLedger> getPaymentInfo(String paymentKey) {
        return paymentLedgerRepository.findAllByPaymentKey(paymentKey);
    }

    @Override
    public PaymentLedger getLatestPaymentInfoOnlyOne(String paymentKey) {
        PaymentLedger paymentLedger = paymentLedgerRepository.findOneByPaymentKeyDesc(paymentKey);

        if (paymentLedger == null) {
            throw new IllegalArgumentException("존재하지 않는 결제 정보입니다. (paymentLedger not exist) " + paymentKey);
        }

        return paymentLedger;
    }

    @Transactional
    @Override
    public String paymentApproved(PaymentApproved paymentInfo) throws IOException {
        String paymentKey = paymentInfo.getPaymentKey();
        
        log.info("Payment approval request received: {}", paymentInfo);
        
        // 먼저 결제된 데이터인지 확인
        if (processedPayments.containsKey(paymentKey)) {
            log.info("Payment already processed (from cache): {}", paymentKey);
            return "success";
        }

        try {
            // 주문 상태 확인 로직을 try-catch로 감싸서 디버깅 정보 제공
            try {
                verifyOrderIsCompleted(UUID.fromString(paymentInfo.getOrderId()));
            } catch (Exception e) {
                log.error("Order verification failed: {}", e.getMessage());
                return "fail";
            }
            
            // 결제 승인 요청 전 로깅
            log.info("Requesting payment approval to payment provider: {}", paymentInfo);
            
            ResponsePaymentApproved response = tossPayment.requestPaymentApprove(paymentInfo);
            log.info("Payment provider response: {}", response);

            if(tossPayment.isPaymentApproved(response.getStatus())) {
                try {
                    // 기존 로직 실행...
                    Order completedOrder = orderRepository.findById(UUID.fromString(response.getOrderId()));
                    completedOrder.orderPaymentFullFill(response.getPaymentKey());

                    // 결제 원장 저장 - 필수 단계
                    paymentLedgerRepository.save(response.toPaymentTransactionEntity());
                    
                    try {
                        // 결제 방식별 상세 정보 저장 - 선택적 단계 (실패해도 전체 결제는 성공으로 처리)
                        PaymentMethod method = PaymentMethod.fromMethodName(response.getMethod());
                        
                        // 결제 방식별 저장소 초기화
                        try {
                            initTransactionTypeRepository(method);
                            TransactionType transactionData = TransactionType.convertToTransactionType(response);
                            transactionTypeRepository.save(transactionData);
                            log.info("Transaction type data saved successfully: {}", method);
                        } catch (Exception e) {
                            // 트랜잭션 타입 변환/저장 실패는 무시하고 진행
                            log.warn("Failed to save transaction type data: {}. Error: {}", 
                                    method, e.getMessage());
                            log.debug("Transaction type error details:", e);
                        }
                    } catch (Exception e) {
                        // 결제 방식 처리 실패는 무시하고 진행
                        log.warn("Payment method processing failed: {}", e.getMessage());
                    }

                    // 캐시에 저장
                    processedPayments.put(paymentKey, true);
                    log.info("Payment approval successfully processed: {}", paymentKey);
                    return "success";
                } catch (Exception e) {
                    log.error("Error while processing successful payment: {}", e.getMessage(), e);
                    return "fail";
                }
            }
            log.warn("Payment not approved by provider. Status: {}", response.getStatus());
            return "fail";

        } catch (IOException e) {
            // 토스 API에서 이미 처리된 결제라고 응답하는 경우도 처리
            if (e.getMessage().contains("ALREADY_PROCESSED_PAYMENT")) {
                log.info("Payment was already processed according to provider: {}", paymentKey);
                processedPayments.put(paymentKey, true);
                return "success";
            }
            log.error("IO Exception during payment approval: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during payment approval: {}", e.getMessage(), e);
            return "fail";
        }
    }



    public void verifyOrderIsCompleted(UUID orderId) {
        OrderStatus orderStatus = orderRepository.findById(orderId).getStatus();

        if(!orderStatus.equals(OrderStatus.ORDER_COMPLETED)) {
            throw new IllegalArgumentException("Order is not completed || Order is already paymented");
        }
    }

    private void initTransactionTypeRepository(PaymentMethod paymentMethod) {
        String methodKey = paymentMethod.toString().toLowerCase();
        transactionTypeRepository = transactionTypeRepositories.get(methodKey);

        if (transactionTypeRepository == null) {
            throw new RuntimeException("Unsupported payment method: " + paymentMethod);
        }
    }

}
