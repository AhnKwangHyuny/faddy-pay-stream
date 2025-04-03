package faddy.payments_app.infrastructure.out.pg.toss.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import faddy.payments_app.domain.payment.PaymentMethod;
import faddy.payments_app.domain.payment.PaymentStatus;
import faddy.payments_app.domain.settlements.PaymentSettlements;
import faddy.payments_app.infrastructure.out.pg.toss.response.payment.Cancel;
import faddy.payments_app.infrastructure.out.pg.toss.response.payment.method.Card;
import java.sql.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@Slf4j
@Builder
public class ResponsePaymentSettlements {
    private String orderId;
    private String paymentKey;
    private String method;
    @JsonProperty("amount")
    private int totalAmount;
    private Card card;
    private Cancel cancel;
    private int payOutAmount; // 지급 금액 결제 금액 amount에서 수수료(fee) 제외
    private String soldDate;
    private String paidOutDate;

    private PaymentStatus converterToEntityAttribute() {
        switch (card.getAcquireStatus()) {
            case "READY":
            case "REQUESTED":
                return PaymentStatus.valueOf("SETTLEMENTS_REQUESTED");
            case "COMPLETED":
                return PaymentStatus.valueOf("SETTLEMENTS_COMPLETED");
            case "CANCEL_REQUESTED":
            case "CANCELED":
                return PaymentStatus.valueOf("SETTLEMENTS_CANCELED");
            default:
                return PaymentStatus.valueOf("SETTLEMENTS_REQUESTED");
        }

    }

    public PaymentSettlements toEntity() {
        return PaymentSettlements.builder()
            .paymentKey(paymentKey)
            .paymentStatus(this.converterToEntityAttribute())
            .method(PaymentMethod.fromMethodName(method))
            .totalAmount(totalAmount)
            .canceledAmount(cancel == null ? 0 : cancel.getCancelAmount())
            .payOutAmount(payOutAmount)
            .soldDate(Date.valueOf(soldDate))
            .paidOutDate(Date.valueOf(paidOutDate))
            .build();
    }

}