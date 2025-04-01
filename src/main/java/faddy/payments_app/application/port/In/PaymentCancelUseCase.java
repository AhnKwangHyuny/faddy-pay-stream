package faddy.payments_app.application.port.In;

import faddy.payments_app.representation.request.order.CancelOrder;

public interface PaymentCancelUseCase {
    boolean paymentCancel(CancelOrder cancelOrder) throws Exception;
}
