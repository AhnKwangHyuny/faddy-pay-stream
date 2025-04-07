package faddy.payments_app.representation.in.web;

import faddy.core.common.ApiResponse;
import faddy.payments_app.application.port.In.PaymentFullfillUseCase;
import faddy.payments_app.representation.request.payment.PaymentApproved;
import java.io.IOException;
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
    private final PaymentFullfillUseCase paymentFullfillUseCase;

    @GetMapping("/success")
    public String paymentFullfill(@RequestParam(value = "paymentType") String paymentType, @RequestParam(value = "orderId") String orderId,
        @RequestParam(value = "paymentKey") String paymentKey, @RequestParam(value = "amount") String amount){
        return "success";
    }

    @GetMapping("/fail")
    public String paymentFail(@RequestParam(value = "message") String message){
        return "fail";
    }

    @PostMapping("/confirm")
    public String paymentConfirm(@RequestBody PaymentApproved paymentInfo) throws IOException {
        return paymentFullfillUseCase.paymentApproved(paymentInfo);
    }

}