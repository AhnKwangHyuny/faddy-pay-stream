package faddy.payments_app.application.port.out.api;

import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentApproved;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentCancel;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentSettlements;
import faddy.payments_app.representation.request.payment.PaymentApproved;
import faddy.payments_app.representation.request.payment.PaymentCancel;
import faddy.payments_app.representation.request.payment.PaymentSettlement;
import java.io.IOException;
import java.util.List;

public interface PaymentAPIs {
    ResponsePaymentApproved requestPaymentApprove(PaymentApproved requestMessage) throws IOException;
    boolean isPaymentApproved(String status);
    ResponsePaymentCancel requestPaymentCancel(String paymentKey, PaymentCancel cancelMessage) throws IOException;
    List<ResponsePaymentSettlements> requestPaymentSettlement(PaymentSettlement paymentSettlement) throws IOException;
}
