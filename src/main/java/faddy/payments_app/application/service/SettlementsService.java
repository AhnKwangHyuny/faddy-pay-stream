package faddy.payments_app.application.service;

import faddy.payments_app.application.port.In.PaymentSettlementsUseCase;
import faddy.payments_app.application.port.In.SendSettlementsInfoUseCase;
import faddy.payments_app.application.port.out.api.PaymentAPIs;
import faddy.payments_app.application.port.out.repository.SettlementRepository;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentSettlements;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SettlementsService implements PaymentSettlementsUseCase {

    private final PaymentAPIs mockPayment;
    private final SettlementRepository settlementRepository;

    @Autowired
    public SettlementsService(@Qualifier("mockTossPayment") PaymentAPIs mockPayment,
        SettlementRepository settlementRepository) {
        this.mockPayment = mockPayment;
        this.settlementRepository = settlementRepository;
    }

    @Override
    public boolean getPaymentSettlements() throws Exception {
        List<ResponsePaymentSettlements> response = mockPayment.requestPaymentSettlement();
        settlementRepository.bulkInsert(response.stream().map(ResponsePaymentSettlements::toEntity).toList());

        return true;
    }
}
