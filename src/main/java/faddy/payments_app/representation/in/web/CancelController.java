package faddy.payments_app.representation.in.web;

import faddy.payments_app.application.port.In.PaymentCancelUseCase;
import faddy.payments_app.representation.request.order.CancelOrder;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cancel")
@RequiredArgsConstructor
@Slf4j
public class CancelController {

    private final PaymentCancelUseCase paymentCancelUseCase;

    @PostMapping("/payment")
    public Boolean cancelPayment(@RequestBody @Valid CancelOrder cancelOrder) throws Exception {
        return paymentCancelUseCase.paymentCancel(cancelOrder);
    }
}
