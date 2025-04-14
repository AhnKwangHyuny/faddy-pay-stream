package faddy.payments_app.application.service;

import faddy.payments_app.application.port.out.api.PaymentAPIs;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentCancel;
import faddy.payments_app.representation.request.order.CancelOrder;
import faddy.payments_app.representation.request.payment.PaymentCancel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentCancelApiService {

    private final PaymentAPIs tossPayment;

    public ResponsePaymentCancel cancelPayment(String paymentKey, CancelOrder cancelOrder) throws Exception {
        try {
            return tossPayment.requestPaymentCancel(
                paymentKey,
                new PaymentCancel(cancelOrder.getCancelReason(), cancelOrder.getCancellationAmount())
            );
        } catch (Exception e) {
            throw new Exception("결제 취소 처리 중 오류가 발생했습니다. (PaymentCancelApiService) " + e.getMessage());
        }
    }
}