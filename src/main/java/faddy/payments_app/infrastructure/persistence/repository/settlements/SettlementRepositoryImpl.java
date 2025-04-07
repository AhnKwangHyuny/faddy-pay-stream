package faddy.payments_app.infrastructure.persistence.repository.settlements;

import faddy.payments_app.application.port.out.repository.SettlementRepository;
import faddy.payments_app.domain.settlements.PaymentSettlements;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@Slf4j
public class SettlementRepositoryImpl implements SettlementRepository {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void bulkInsert(List<PaymentSettlements> paymentSettlements) {
        String sqlStatement = "INSERT INTO payment_settlements (payment_id, method, settlements_status, total_amount, pay_out_amount, canceled_amount, sold_date, paid_out_date)" +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.batchUpdate(
            sqlStatement,
            paymentSettlements,
            paymentSettlements.size(),
            (PreparedStatement ps, PaymentSettlements data) -> {
                ps.setString(1, data.getPaymentKey());
                ps.setString(2, data.getMethod().getMethodName());
                ps.setString(3, data.getPaymentStatus().toString());
                ps.setInt(4, data.getTotalAmount());
                ps.setInt(5, data.getPayOutAmount());
                ps.setInt(6, data.getCanceledAmount());
                ps.setDate(7, data.getSoldDate());
                ps.setDate(8, data.getPaidOutDate());

            }
        );
    }
}
