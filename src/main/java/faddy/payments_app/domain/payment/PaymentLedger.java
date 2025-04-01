package faddy.payments_app.domain.payment;

import faddy.payments_app.domain.common.TimeBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payment_transaction")
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class PaymentLedger extends TimeBaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "payment_id")
    private String paymentKey; // example) tgen_20240605132741Jtkz1

    @Convert(converter = PaymentMethodConverter.class)
    private PaymentMethod method; // CARD:카드

    @Column(name = "payment_status")
    @Convert(converter = PaymentStatusConverter.class)
    private PaymentStatus paymentStatus; // DONE, CANCELED, PARTIAL_CANCELED, SETTLEMENTS_REQUESTED, SETTLEMENTS_COMPLETED

    @Column(name = "total_amount")
    private int totalAmount; // 원래 결제 금액

    @Column(name = "balance_amount")
    private int balanceAmount; // 취소 가능한 남은 금액

    @Column(name = "canceled_amount")
    private int canceledAmount; // 이미 취소된 금액

    @Column(name = "pay_out_amount")
    private int payOutAmount; //전산(지급)액

    public boolean isCancellableAmountGreaterThan(int cancellationAmount){
        return balanceAmount >= cancellationAmount;
    }

}
