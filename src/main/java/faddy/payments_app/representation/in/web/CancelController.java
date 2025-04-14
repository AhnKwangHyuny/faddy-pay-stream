package faddy.payments_app.representation.in.web;

import faddy.payments_app.application.port.In.PaymentCancelUseCase;
import faddy.payments_app.representation.request.order.CancelOrder;
import faddy.payments_app.representation.response.payment.CancelPaymentResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    private final PaymentCancelUseCase paymentCancelService;

    /**
     * 결제 취소 API
     *
     * @param cancelOrder 취소 요청 정보 (주문ID, 취소항목, 취소사유, 결제키, 취소금액)
     * @return 취소 결과 응답
     */
    @PostMapping("/payment")
    public CancelPaymentResponseDto cancelPayment(@RequestBody @Valid CancelOrder cancelOrder) throws Exception {
        return paymentCancelService.paymentCancel(cancelOrder);
    }
}