package faddy.payments_app.infrastructure.out.pg.toss;

import com.fasterxml.jackson.databind.ObjectMapper;
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

/**
 * 토스 페이먼츠 API를 사용하는 결제 처리 구현체
 *
 * <p>이 클래스는 토스 페이먼츠 PG와의 통신을 담당하며 결제 관련 주요 기능을 제공
 * - 결제 승인 요청: {@link #requestPaymentApprove(PaymentApproved)}
 * - 결제 상태 확인: {@link #isPaymentApproved(String)}
 * - 결제 취소 요청: {@link #requestPaymentCancel(String, PaymentCancel)}
 * - 정산 정보 조회: {@link #requestPaymentSettlement(PaymentSettlement paymentSettlement)}
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
        try {
            // 요청 데이터 로깅
            String orderId = paymentInfo.getOrderId();
            String paymentKey = paymentInfo.getPaymentKey();
            Integer amount = paymentInfo.getAmount();
            
            // NULL 체크
            if (paymentKey == null || orderId == null || amount == null) {
                throw new IOException("필수 파라미터가 누락되었습니다: paymentKey=" + paymentKey + 
                    ", orderId=" + orderId + ", amount=" + amount);
            }
            
            // 로깅 강화
            System.out.println("==== 토스페이먼츠 API 호출 시작 ====");
            System.out.println("요청 데이터: " + paymentInfo.toString());
            
            // 전체 URL 로깅 (디버깅 용도)
            System.out.println("요청 엔드포인트: payments/confirm");
            
            // 환경 변수에서 baseUrl 직접 가져오기 (AopProxyUtils 대신 이 방법 사용)
            String baseUrl = "https://api.tosspayments.com/v1";
            System.out.println("API Base URL: " + baseUrl);
            System.out.println("전체 요청 URL: " + baseUrl + "/payments/confirm");
            
            // OKHTTP 요청 디버깅 (요청 전문 확인)
            ObjectMapper mapper = new ObjectMapper();
            mapper.setSerializationInclusion(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL);
            
            System.out.println("========= 토스페이먼츠 API 요청 정보 =========");
            System.out.println("요청 JSON: " + mapper.writeValueAsString(paymentInfo));
            System.out.println("요청 URL: https://api.tosspayments.com/v1/payments/confirm");
            System.out.println("요청 필드: paymentKey, orderId, amount");
            System.out.println("=========================================");
                
            // API 호출
            Response<ResponsePaymentApproved> response = tossClient.paymentFullfill(paymentInfo).execute();
            
            System.out.println("응답 코드: " + response.code());
            System.out.println("응답 메시지: " + response.message());
            System.out.println("응답 헤더: " + response.headers());
            
            if(response.isSuccessful()) {
                System.out.println("응답 본문: " + mapper.writeValueAsString(response.body()));
                return response.body();
            } else {
                String errorBody = response.errorBody() != null ? 
                    response.errorBody().string() : "에러 내용 없음";
                System.out.println("에러 본문: " + errorBody);
                
                // 요청 실패 원인 상세 분석
                System.out.println("토스페이먼츠 API 응답 실패: HTTP " + response.code());
                System.out.println("에러 메시지: " + errorBody);
                
                if (response.code() == 404) {
                    System.out.println("404 에러: API 엔드포인트를 찾을 수 없습니다. URL을 확인하세요.");
                    System.out.println("요청 URL: https://api.tosspayments.com/v1/payments/confirm");
                } else if (response.code() == 401) {
                    System.out.println("401 에러: 인증에 실패했습니다. 시크릿 키를 확인하세요.");
                } else if (response.code() == 400) {
                    System.out.println("400 에러: 잘못된 요청입니다. 요청 파라미터를 확인하세요.");
                }
                
                throw new IOException(errorBody);
            }
        } catch (IOException e) {
            System.out.println("토스페이먼츠 API 예외 발생: " + e.getMessage());
            System.out.println("==== 토스페이먼츠 API 호출 실패 ====");
            throw e;
        } catch (Exception e) {
            System.out.println("예상치 못한 예외 발생: " + e.getClass().getName() + ": " + e.getMessage());
            System.out.println("==== 토스페이먼츠 API 호출 실패 ====");
            throw new IOException("요청 처리 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
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
    public List<ResponsePaymentSettlements> requestPaymentSettlement(PaymentSettlement paymentSettlement) throws IOException {
        String startDate = paymentSettlement.getStartDate();
        String endDate = paymentSettlement.getEndDate();
        int page = paymentSettlement.getPage();
        int size = paymentSettlement.getSize();

        Response<List<ResponsePaymentSettlements>> response = tossClient.paymentSettlements(startDate, endDate, page, size).execute();
        if(response.isSuccessful() && response.body() != null && !response.body().isEmpty())  {
            return response.body();
        }

        throw new IOException(response.message());
    }

}