package faddy.payments_app.infrastructure.out.pg.toss.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import faddy.payments_app.domain.payment.PaymentLedger;
import faddy.payments_app.domain.payment.PaymentMethod;
import faddy.payments_app.domain.payment.PaymentStatus;
import faddy.payments_app.infrastructure.out.pg.toss.response.payment.ResponsePaymentCommon;
import javax.smartcardio.Card;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResponsePaymentApproved extends ResponsePaymentCommon {
    private String orderName;
    private Card card;
    private String lastTransactionKey;
    private int suppliedAmount; // 공급 가액
    private int vat;
    private String requestedAt;
    private String approvedAt;

    public PaymentLedger toPaymentTransactionEntity() {
        return PaymentLedger.builder()
            .paymentKey(this.getPaymentKey())
            .method(PaymentMethod.fromMethodName(this.getMethod()))
            .paymentStatus(PaymentStatus.valueOf(this.getStatus()))
            .totalAmount(this.getTotalAmount())
            .balanceAmount(this.getBalanceAmount())
            .canceledAmount(0)
            .build();
    }
}
