package faddy.payments_app.infrastructure.out.pg.mock;

import faddy.payments_app.application.port.out.api.PaymentAPIs;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentApproved;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentCancel;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentSettlements;
import faddy.payments_app.representation.request.payment.PaymentApproved;
import faddy.payments_app.representation.request.payment.PaymentCancel;
import faddy.payments_app.representation.request.payment.PaymentSettlement;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import retrofit2.Response;

@Component("mockTossPayment")
@RequiredArgsConstructor
public class MockTossPayment implements PaymentAPIs {

    private final MockTossPaymentAPIs mockTossClient;

    @Override
    public ResponsePaymentApproved requestPaymentApprove(PaymentApproved paymentInfo)
        throws IOException {
        return null;
    }

    @Override
    public boolean isPaymentApproved(String status) {
        return "DONE".equalsIgnoreCase(status);
    }

    @Override
    public ResponsePaymentCancel requestPaymentCancel(String paymentKey,
        PaymentCancel cancelMessage) throws IOException {
        return null;
    }

    @Override
    public List<ResponsePaymentSettlements> requestPaymentSettlement(PaymentSettlement paymentSettlement) throws IOException {
        String startDate = paymentSettlement.getStartDate();
        String endDate = paymentSettlement.getEndDate();
        int page = paymentSettlement.getPage();
        int size = paymentSettlement.getSize();

        Response<List<ResponsePaymentSettlements>> response = mockTossClient.paymentSettlements().execute();
        if(response.isSuccessful() && response.body() != null && !response.body().isEmpty())  {
            return response.body();
        }

        throw new IOException(response.message());
    }


}