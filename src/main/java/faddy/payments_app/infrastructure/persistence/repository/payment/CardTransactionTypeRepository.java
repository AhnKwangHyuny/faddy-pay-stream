package faddy.payments_app.infrastructure.persistence.repository.payment;

import faddy.payments_app.application.port.out.repository.TransactionTypeRepository;
import faddy.payments_app.domain.payment.TransactionType;
import faddy.payments_app.domain.payment.card.CardPayment;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CardTransactionTypeRepository implements TransactionTypeRepository {

    private final JpaCardPaymentRepository jpaCardPaymentRepository;

    @Override
    public CardPayment findById(String paymentKey) {
        return jpaCardPaymentRepository.findById(paymentKey)
            .orElseThrow(() -> new NoSuchElementException(String.format("CardPayment with key '%s' not found", paymentKey)));
    }

    @Override
    public void save(TransactionType paymentDetailInfo) {
        jpaCardPaymentRepository.save((CardPayment) paymentDetailInfo);
    }
}
