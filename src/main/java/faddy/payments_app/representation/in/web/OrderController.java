package faddy.payments_app.representation.in.web;

import faddy.payments_app.application.port.In.CreateNewOrderUseCase;
import faddy.payments_app.representation.request.order.PurchaseOrder;
import faddy.payments_app.representation.response.order.NewPurchaseOrderDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final CreateNewOrderUseCase createNewOrderUseCase;

    @PostMapping("/new")
    public NewPurchaseOrderDto newOrder(@RequestBody @Valid PurchaseOrder newOrder) throws Exception {
        log.info("Creating new order {}", newOrder);
        return NewPurchaseOrderDto.from(createNewOrderUseCase.createOrder(newOrder));
    }
}
