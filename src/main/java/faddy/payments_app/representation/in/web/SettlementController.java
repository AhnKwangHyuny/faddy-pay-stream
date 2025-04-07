package faddy.payments_app.representation.in.web;

import faddy.payments_app.application.port.In.PaymentSettlementsUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("settlements")
public class SettlementController {
    private final PaymentSettlementsUseCase paymentSettlementsUseCase;

    @GetMapping
    public boolean getPaymentSettlements() throws Exception {
        return paymentSettlementsUseCase.getPaymentSettlements();
    }
}
