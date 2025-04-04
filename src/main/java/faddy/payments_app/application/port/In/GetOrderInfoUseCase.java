package faddy.payments_app.application.port.In;

import faddy.payments_app.domain.order.Order;
import java.util.UUID;

public interface GetOrderInfoUseCase {
    Order getOrderById(UUID orderId);
}