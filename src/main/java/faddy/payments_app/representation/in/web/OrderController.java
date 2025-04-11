package faddy.payments_app.representation.in.web;

import faddy.payments_app.application.port.In.CreateNewOrderUseCase;
import faddy.payments_app.application.port.In.GetOrderInfoUseCase;
import faddy.payments_app.domain.order.Order;
import faddy.payments_app.representation.request.order.PurchaseOrder;
import faddy.payments_app.representation.response.order.NewPurchaseOrderDto;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"}, allowCredentials = "true")
public class OrderController {

    private final CreateNewOrderUseCase createNewOrderUseCase;
    private final GetOrderInfoUseCase getOrderInfoUseCase;

    @PostMapping("/new")
    public NewPurchaseOrderDto newOrder(@RequestBody @Valid PurchaseOrder newOrder) throws Exception {
        log.info("Creating new order {}", newOrder);
        return NewPurchaseOrderDto.from(createNewOrderUseCase.createOrder(newOrder));
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<NewPurchaseOrderDto> getOrder(@PathVariable String orderId) {
        log.info("Fetching order with ID: {}", orderId);
        try {
            UUID orderUUID = UUID.fromString(orderId);
            Order order = getOrderInfoUseCase.getOrderById(orderUUID);
            
            if (order != null) {
                return ResponseEntity.ok(NewPurchaseOrderDto.from(order));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format: {}", orderId, e);
            return ResponseEntity.badRequest().build();
        }
    }
}
