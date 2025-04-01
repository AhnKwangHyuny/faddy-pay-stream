package faddy.payments_app.application.port.In;

import faddy.payments_app.representation.request.payment.PaymentApproved;
import java.io.IOException;

public interface PaymentFullfillUseCase {
    String paymentApproved(PaymentApproved paymentInfo) throws IOException;
}
