package faddy.payments_app.representation.in.web;

import faddy.core.common.ApiResponse;
import faddy.payments_app.application.port.In.PaymentCancelUseCase;
import faddy.payments_app.representation.request.order.CancelOrder;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/cancel")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(
    origins = {"http://localhost:3000", "http://localhost:8080"}, 
    allowedHeaders = "*", 
    methods = {
        org.springframework.web.bind.annotation.RequestMethod.GET,
        org.springframework.web.bind.annotation.RequestMethod.POST,
        org.springframework.web.bind.annotation.RequestMethod.PUT,
        org.springframework.web.bind.annotation.RequestMethod.DELETE,
        org.springframework.web.bind.annotation.RequestMethod.OPTIONS
    },
    allowCredentials = "true"
)
public class CancelController {

    private final PaymentCancelUseCase paymentCancelUseCase;

    /**
     * 결제 취소 API
     * 
     * @param cancelOrder 취소 요청 정보 (주문ID, 취소항목, 취소사유, 결제키, 취소금액)
     * @return 취소 결과 응답
     */
    @PostMapping("/payment")
    public ResponseEntity<ApiResponse<Map<String, Object>>> cancelPayment(
            @RequestBody @Valid CancelOrder cancelOrder) {
        
        log.info("결제 취소 요청 수신: {}", cancelOrder);
        
        try {
            // UUID 정보 로깅
            log.info("주문 ID 정보: {}", cancelOrder.getOrderId());
            
            // 취소 처리 요청
            boolean result = paymentCancelUseCase.paymentCancel(cancelOrder);
            
            // 응답 데이터 구성
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("cancelled", result);
            responseData.put("orderId", cancelOrder.getOrderId().toString());
            responseData.put("paymentKey", cancelOrder.getPaymentKey());
            responseData.put("cancellationAmount", cancelOrder.getCancellationAmount());
            
            if (result) {
                log.info("결제 취소 성공: {}", cancelOrder.getOrderId());
                return ResponseEntity.ok(ApiResponse.success(responseData));
            } else {
                log.warn("결제 취소 실패: {}", cancelOrder.getOrderId());
                return ResponseEntity.badRequest().body(ApiResponse.fail("결제 취소에 실패했습니다"));
            }
        } catch (IllegalArgumentException e) {
            // 요청 데이터 오류 (400)
            log.error("잘못된 결제 취소 요청: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        } catch (IllegalStateException e) {
            // 비즈니스 로직 오류 (400)
            log.error("결제 취소 상태 오류: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            // 서버 내부 오류 (500)
            log.error("결제 취소 처리 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(
                ApiResponse.fail("결제 취소 처리 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}