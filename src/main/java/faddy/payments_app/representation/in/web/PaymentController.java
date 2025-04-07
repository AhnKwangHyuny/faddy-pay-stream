package faddy.payments_app.representation.in.web;

import faddy.core.common.ApiResponse;
import faddy.payments_app.application.port.In.PaymentFullfillUseCase;
import faddy.payments_app.representation.request.payment.PaymentApproved;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    private final PaymentFullfillUseCase paymentFullFillService;

    @GetMapping("/success")
    public ApiResponse<String> paymentFullfill(@RequestParam(value = "paymentType") String paymentType,
        @RequestParam(value = "orderId") String orderId,
        @RequestParam(value = "paymentKey") String paymentKey,
        @RequestParam(value = "amount") String amount
    ) {
        return new ApiResponse<>("결제가 성공적으로 처리되었습니다",
            "결제유형: " + paymentType + ", 주문번호: " + orderId +
                ", 결제키: " + paymentKey + ", 금액: " + amount);
    }

    @GetMapping("/fail")
    public ApiResponse<String> paymentFail(@RequestParam(value = "message") String message) {
        return new ApiResponse<>("결제 실패", message);
    }

    @PostMapping("/confirm")
    public ApiResponse<String> paymentConfirm(@RequestBody PaymentApproved paymentApproved) throws Exception {
        try {
            String result = paymentFullFillService.paymentApproved(paymentApproved);
            return new ApiResponse<>("결제 승인 완료", result);
        } catch (Exception e) {
            return new ApiResponse<>("결제 승인 오류", e.getMessage());
        }
    }
}