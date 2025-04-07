package faddy.payments_app.infrastructure.out.pg.mock;

import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentSettlements;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;

public interface MockTossPaymentAPIs {
    @GET("settlements")
    Call<List<ResponsePaymentSettlements>> paymentSettlements();
}
