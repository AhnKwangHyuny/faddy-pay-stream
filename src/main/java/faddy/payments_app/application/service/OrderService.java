package faddy.payments_app.application.service;

import faddy.payments_app.application.port.In.CreateNewOrderUseCase;
import faddy.payments_app.application.port.In.GetOrderInfoUseCase;
import faddy.payments_app.application.port.out.repository.OrderRepository;
import faddy.payments_app.domain.order.Order;
import faddy.payments_app.representation.request.order.PurchaseOrder;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService implements CreateNewOrderUseCase, GetOrderInfoUseCase {

    private final OrderRepository orderRepository;

    @Override
    public Order createOrder(PurchaseOrder newOrder) throws Exception {

        Order order = newOrder.toEntity();

        return orderRepository.save(order);

    }

    @Override
    public Order getOrderById(UUID orderId) {
        return orderRepository.findById(orderId);
    }
}
