package faddy.payments_app.infrastructure.persistence.repository.payment;

import faddy.payments_app.domain.payment.PaymentLedger;
import faddy.payments_app.infrastructure.persistence.repository.JpaBaseRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaPaymentLedgerRepository extends JpaBaseRepository<PaymentLedger, String> {

    Optional<List<PaymentLedger>> findByPaymentKey(String paymentKey);

    Optional<PaymentLedger> findTopByPaymentKeyOrderByIdDesc(String paymentKey);
}