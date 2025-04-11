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
        return paymentLedgerRepository.findOneByPaymentKeyDesc(paymentKey);
    }

    @Transactional
    @Override
    public String paymentApproved(PaymentApproved paymentInfo) throws IOException {
        String paymentKey = paymentInfo.getPaymentKey();
        // 먼저 결제된 데이터인지 확인
        if (processedPayments.containsKey(paymentKey)) {
            log.info("Payment already processed (from cache): {}", paymentKey);
            return "success";
        }

        try {
            verifyOrderIsCompleted(UUID.fromString(paymentInfo.getOrderId()));
            ResponsePaymentApproved response = tossPayment.requestPaymentApprove(paymentInfo);

            if(tossPayment.isPaymentApproved(response.getStatus())) {
                // 기존 로직 실행...
                Order completedOrder = orderRepository.findById(UUID.fromString(response.getOrderId()));
                completedOrder.orderPaymentFullFill(response.getPaymentKey());

                paymentLedgerRepository.save(response.toPaymentTransactionEntity());
                PaymentMethod method = PaymentMethod.fromMethodName(response.getMethod());

                initTransactionTypeRepository(method);
                transactionTypeRepository.save(TransactionType.convertToTransactionType(response));

                // 캐시에 저장
                processedPayments.put(paymentKey, true);
                return "success";
            }
            return "fail";

        } catch (IOException e) {
            // 토스 API에서 이미 처리된 결제라고 응답하는 경우도 처리
            if (e.getMessage().contains("ALREADY_PROCESSED_PAYMENT")) {
                processedPayments.put(paymentKey, true);
                return "success";
            }
            throw e;
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
