package faddy.payments_app.application.port.In;

import java.util.UUID;
import org.springframework.core.annotation.Order;

public interface GetOrderInfoUseCase {
    Order getOrderInfo(UUID orderId);
}