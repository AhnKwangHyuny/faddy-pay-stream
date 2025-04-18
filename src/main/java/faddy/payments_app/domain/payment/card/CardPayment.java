package faddy.payments_app.domain.payment.card;

import faddy.payments_app.domain.payment.TransactionType;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentApproved;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "card_payment")
@Getter
@SuperBuilder
@AllArgsConstructor
public class CardPayment extends TransactionType {
    @Id
    @Column(name = "payment_key")
    private String paymentKey; // example) tgen_20240605132741Jtkz1

    @Column(name = "card_number")
    private String cardNumber;

    @Column(name = "approve_no")
    private String approveNo;

    @Column(name = "acquire_status")
    @Convert(converter = AcquireStatusConverter.class)
    private AcquireStatus acquireStatus;

    @Column(name = "issuer_code")
    private String issuer_code;

    @Column(name = "acquirer_code")
    private String acquirerCode;

    @Column(name = "acquirer_status")
    private String acquirerStatus;

    protected CardPayment() {
    }

    public static CardPayment from(ResponsePaymentApproved response) {
        return CardPayment.builder()
            .paymentKey(response.getPaymentKey())
            .cardNumber(response.getCard().getNumber())
            .approveNo(response.getCard().getApproveNo())
            .acquireStatus(AcquireStatus.valueOf(response.getCard().getAcquireStatus()))
            .acquirerCode(response.getCard().getAcquirerCode())
            .acquirerStatus(response.getCard().getAcquireStatus())
            .build();
    }
}
