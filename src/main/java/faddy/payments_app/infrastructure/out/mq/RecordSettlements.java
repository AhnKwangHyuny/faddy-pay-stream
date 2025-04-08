package faddy.payments_app.infrastructure.out.mq;
import faddy.payments_app.domain.settlements.PaymentSettlements;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class RecordSettlements {

    private int id;

    private String paymentKey;

    private String method;

    private String paymentStatus;

    private int totalAmount;

    private int payOutAmount;

    private int canceledAmount;

    private String soldDate;

    private String paidOutDate;

    public static RecordSettlements from(PaymentSettlements paymentSettlements) {
        return RecordSettlements.builder()
            .id(paymentSettlements.getId())
            .paymentKey(paymentSettlements.getPaymentKey())
            .paymentStatus(paymentSettlements.getPaymentStatus().toString())
            .totalAmount(paymentSettlements.getTotalAmount())
            .payOutAmount(paymentSettlements.getPayOutAmount())
            .canceledAmount(paymentSettlements.getCanceledAmount())
            .soldDate(paymentSettlements.getSoldDate().toString())
            .paidOutDate(paymentSettlements.getPaidOutDate().toString())
            .build();
    }
}