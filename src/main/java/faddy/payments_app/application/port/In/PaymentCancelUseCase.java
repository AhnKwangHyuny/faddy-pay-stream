package faddy.payments_app.application.port.In;

import faddy.payments_app.representation.request.order.CancelOrder;
import faddy.payments_app.representation.response.payment.CancelPaymentResponseDto;

public interface PaymentCancelUseCase {
    CancelPaymentResponseDto paymentCancel(CancelOrder cancelOrder) throws Exception;
}
