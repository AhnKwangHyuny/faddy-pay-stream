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

/**
 * 토스페이먼츠 API 인터페이스
 * 
 * 문서: https://docs.tosspayments.com/reference
 */
public interface TossPaymentAPIs {
    /**
     * 결제 승인 API
     * 
     * 문서: https://docs.tosspayments.com/reference/apis/payment-confirmation
     */
    @POST("payments/confirm")
    Call<ResponsePaymentApproved> paymentFullfill(@Body PaymentApproved requestMessage);

    /**
     * 결제 취소 API
     * 
     * 문서: https://docs.tosspayments.com/reference/apis/payment-cancel
     */
    @POST("payments/{paymentKey}/cancel")
    Call<ResponsePaymentCancel> paymentCancel(@Path("paymentKey") String paymentKey, @Body PaymentCancel requestMessage);

    /**
     * 정산 내역 조회 API
     * 
     * 문서: https://docs.tosspayments.com/reference/apis/settlement
     */
    @GET("settlements")
    Call<List<ResponsePaymentSettlements>> paymentSettlements(
        @retrofit2.http.Query("startDate") String startDate,
        @retrofit2.http.Query("endDate") String endDate,
        @retrofit2.http.Query("page") int page,
        @retrofit2.http.Query("size") int size);
}