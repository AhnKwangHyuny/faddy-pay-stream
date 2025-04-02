package faddy.payments_app.application.port.out.repository;

import faddy.payments_app.domain.payment.TransactionType;

public interface TransactionTypeRepository {
    TransactionType findById(String paymentKey);
    void save(TransactionType paymentDetailInfo);
}