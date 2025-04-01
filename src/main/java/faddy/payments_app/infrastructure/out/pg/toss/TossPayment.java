package faddy.payments_app.infrastructure.out.pg.toss;

import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentApproved;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentCancel;
import faddy.payments_app.representation.request.payment.PaymentApproved;
import faddy.payments_app.representation.request.payment.PaymentCancel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import retrofit2.Call;

@Component
@RequiredArgsConstructor
public class TossPayment implements TossPaymentAPIs{

    private final TossPaymentAPIs tossPaymentAPIs;

    @Override
    public Call<ResponsePaymentApproved> requestPaymentApprove(PaymentApproved requestMessage) {
        return null;
    }

    @Override
    public Call<ResponsePaymentCancel> paymentCancel(String paymentKey,
        PaymentCancel requestMessage) {
        return null;
    }
}
