package faddy.payments_app.application.port.out.repository;

import faddy.payments_app.domain.settlements.PaymentSettlements;
import java.util.List;

public interface SettlementRepository {
    void bulkInsert(List<PaymentSettlements> paymentSettlements);
}
