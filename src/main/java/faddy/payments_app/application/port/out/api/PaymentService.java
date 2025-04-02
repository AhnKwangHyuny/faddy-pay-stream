package faddy.payments_app.application.port.out.api;

import faddy.payments_app.application.port.In.GetPaymentInfoUseCase;
import faddy.payments_app.application.port.In.PaymentFullfillUseCase;
import faddy.payments_app.application.port.out.repository.TransactionTypeRepository;
import faddy.payments_app.domain.payment.PaymentLedger;
import faddy.payments_app.representation.request.payment.PaymentApproved;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
//@Transactional // 모듈 수준에서 격리
@RequiredArgsConstructor
@Slf4j
public class PaymentService implements PaymentFullfillUseCase, GetPaymentInfoUseCase {

    private final Map<String, TransactionTypeRepository> transactionTypeRepositories = new HashMap<>();
    private TransactionTypeRepository transactionTypeRepository;

    @Override
    public List<PaymentLedger> getPaymentInfo(String paymentKey) {
        return List.of();
    }

    @Override
    public PaymentLedger getLatestPaymentInfoOnlyOne(String paymentKey) {
        return null;
    }

    @Override
    public String paymentApproved(PaymentApproved paymentInfo) throws IOException {
        return "";
    }
}
