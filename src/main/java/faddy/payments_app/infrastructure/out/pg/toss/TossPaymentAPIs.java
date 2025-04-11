package faddy.payments_app.infrastructure.out.pg.toss;

import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentApproved;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentCancel;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentSettlements;
import faddy.payments_app.representation.request.payment.PaymentApproved;
import faddy.payments_app.representation.request.payment.PaymentCancel;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface TossPaymentAPIs {
    @POST("v1/payments/confirm")
    Call<ResponsePaymentApproved> paymentFullfill(@Body PaymentApproved requestMessage);

    @POST("v1/payments/{paymentKey}/cancel")
    Call<ResponsePaymentCancel> paymentCancel(@Path("paymentKey") String paymentKey, @Body PaymentCancel requestMessage);

    @GET("v1/settlements")
    Call<List<ResponsePaymentSettlements>> paymentSettlements(@Path("startDate") String startDate,
        @Path("endDate") String endDate,
        @Path("page") int page,
        @Path("size") int size);
}