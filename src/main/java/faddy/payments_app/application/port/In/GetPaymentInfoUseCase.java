package faddy.payments_app.application.port.In;

import faddy.payments_app.domain.payment.PaymentLedger;
import java.util.List;

public interface GetPaymentInfoUseCase {
    List<PaymentLedger> getPaymentInfo(String paymentKey);
    PaymentLedger getLatestPaymentInfoOnlyOne(String paymentKey);
}