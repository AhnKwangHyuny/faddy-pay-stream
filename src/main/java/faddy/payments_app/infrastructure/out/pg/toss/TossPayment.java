package faddy.payments_app.infrastructure.out.pg.toss;

import faddy.payments_app.application.port.out.api.PaymentAPIs;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentApproved;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentCancel;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentSettlements;
import faddy.payments_app.representation.request.payment.PaymentApproved;
import faddy.payments_app.representation.request.payment.PaymentCancel;
import faddy.payments_app.representation.request.payment.PaymentSettlement;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import retrofit2.Response;

/**
 * 토스 페이먼츠 API를 사용하는 결제 처리 구현체
 *
 * <p>이 클래스는 토스 페이먼츠 PG와의 통신을 담당하며 결제 관련 주요 기능을 제공
 * - 결제 승인 요청: {@link #requestPaymentApprove(PaymentApproved)}
 * - 결제 상태 확인: {@link #isPaymentApproved(String)}
 * - 결제 취소 요청: {@link #requestPaymentCancel(String, PaymentCancel)}
 * - 정산 정보 조회: {@link #requestPaymentSettlement()}
 *
 *
 * @see PaymentAPIs 결제 처리 인터페이스
 * @see TossPaymentAPIs 토스 페이먼츠 API 클라이언트 인터페이스
 */

@Component("tossPayment")
@RequiredArgsConstructor
public class TossPayment implements PaymentAPIs {

    private final TossPaymentAPIs tossClient;

    /**
     * 결제 승인 요청을 처리
     *
     * 클라이언트에서 받은 결제 정보를 토스 페이먼츠 API로 전달하여 결제를 승인
     * 승인 성공 시 paymentKey가 포함된 응답을 반환
     *
     * @param paymentInfo 결제 승인에 필요한 정보 (주문번호, 금액 등)
     * @return 결제 승인 응답 정보 (paymentKey, 결제 상태 등)
     * @throws IOException API 호출 실패 또는 결제 승인 실패 시 발생
     */

    @Override
    public ResponsePaymentApproved requestPaymentApprove(PaymentApproved paymentInfo)
        throws IOException {

        Response<ResponsePaymentApproved> response = tossClient.paymentFullfill(paymentInfo).execute();

        if(response.isSuccessful()) {
            return response.body();
        }

        throw new IOException(response.errorBody().string());
    }

    /**
     * 결제 상태가 승인 완료 상태인지 확인
     *
     * 토스 페이먼츠 API 응답의 status 필드가 "DONE"인 경우 결제가 성공적으로 완료됨
     *
     * @param status 확인할 결제 상태 문자열
     * @return 결제 승인 완료 여부 (true: 승인 완료, false: 그 외 상태)
     */

    @Override
    public boolean isPaymentApproved(String status) {
        return "DONE".equalsIgnoreCase(status);
    }

    /**
     * 결제 취소 요청을 처리
     *
     * 이미 승인된 결제에 대해 취소 요청을 토스 페이먼츠 API로 전달합
     * 취소 성공 시 취소된 결제 정보가 포함된 응답을 반환
     *
     * @param paymentKey 취소할 결제의 고유 식별자
     * @param cancelMessage 취소 사유 및 관련 정보
     * @return 결제 취소 응답 정보
     * @throws IOException API 호출 실패 또는 결제 취소 실패 시 발생
     */

    @Override
    public ResponsePaymentCancel requestPaymentCancel(String paymentKey,
        PaymentCancel cancelMessage) throws IOException {

        Response<ResponsePaymentCancel> response = tossClient.paymentCancel(paymentKey, cancelMessage).execute();
        if(response.isSuccessful()) {
            return response.body();
        }

        throw new IOException(response.errorBody().string());
    }

    /**
     * 정산 정보를 조회
     *
     * 지정된 기간 내의 정산 정보를 페이징 처리하여 조회
     * 정산 정보가 없거나 API 호출이 실패하면 예외가 발생
     *
     * @return 조회된 정산 정보 목록
     * @throws IOException API 호출 실패 또는 정산 정보가 없는 경우 발생
     */

    @Override
    public List<ResponsePaymentSettlements> requestPaymentSettlement() throws IOException {
        String startDate = LocalDate.now(ZoneId.of("Asia/Seoul")).minusDays(3).toString();
        String endDate = LocalDate.now(ZoneId.of("Asia/Seoul")).toString();
        int page = 1;
        int size = 5000;

        Response<List<ResponsePaymentSettlements>> response = tossClient.paymentSettlements(startDate, endDate, page, size).execute();
        if(response.isSuccessful() && response.body() != null && !response.body().isEmpty())  {
            return response.body();
        }


        throw new IOException(response.message());
    }

}