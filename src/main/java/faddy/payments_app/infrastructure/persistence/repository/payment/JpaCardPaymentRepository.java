package faddy.payments_app.infrastructure.persistence.repository.payment;

import faddy.payments_app.domain.payment.card.CardPayment;
import faddy.payments_app.infrastructure.persistence.repository.JpaBaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaCardPaymentRepository extends JpaBaseRepository<CardPayment, String> {

}