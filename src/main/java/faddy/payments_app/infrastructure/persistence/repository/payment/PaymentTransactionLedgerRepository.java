package faddy.payments_app.infrastructure.persistence.repository.payment;

import faddy.payments_app.application.port.out.repository.PaymentLedgerRepository;
import faddy.payments_app.domain.payment.PaymentLedger;
import java.sql.PreparedStatement;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PaymentTransactionLedgerRepository implements PaymentLedgerRepository {

    private final JdbcTemplate jdbcTemplate;
    private final JpaPaymentLedgerRepository jpaPaymentLedgerRepository;

    @Override
    public List<PaymentLedger> findAllByPaymentKey(String paymentKey) {
        return jpaPaymentLedgerRepository.findByPaymentKey(paymentKey)
            .orElseThrow(() -> new NullPointerException("findAllByPaymentKey ::: Not found Payment Transactions"));
    }

    @Override
    public PaymentLedger findOneByPaymentKeyDesc(String paymentKey) {
        return jpaPaymentLedgerRepository.findTopByPaymentKeyOrderByIdDesc(paymentKey)
            .orElseThrow(() -> new NullPointerException("findOneByPaymentKeyDesc ::: Not found Payment Transaction"));
    }

    @Override
    public void save(PaymentLedger paymentLedgerInfo) {
        jpaPaymentLedgerRepository.save(paymentLedgerInfo);
    }

    @Override
    public void bulkInsert(List<PaymentLedger> paymentLedgerHistories) {
        String sqlStatement = "INSERT INTO payment_transaction (payment_id, method, payment_Status, total_amount, balance_amount, canceled_amount, pay_out_amount) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.batchUpdate(
            sqlStatement,
            paymentLedgerHistories,
            paymentLedgerHistories.size(),
            (PreparedStatement ps, PaymentLedger data) -> {
                ps.setString(1, data.getPaymentKey());
                ps.setString(2, data.getMethod().toString());
                ps.setString(3, data.getPaymentStatus().toString());
                ps.setInt(4, data.getTotalAmount());
                ps.setInt(5, data.getBalanceAmount());
                ps.setInt(6, data.getCanceledAmount());
                ps.setInt(7, data.getPayOutAmount());
            });
    }
}
