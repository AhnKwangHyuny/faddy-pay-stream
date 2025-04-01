package faddy.payments_app.representation.request.payment;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PaymentApproved {
    private final String paymentType;
    private final String paymentKey;
    private final String orderId;
    private final String amount;
}
