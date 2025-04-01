package faddy.payments_app.application.port.In;

import faddy.payments_app.representation.request.order.PurchaseOrder;
import org.springframework.core.annotation.Order;

public interface CreateNewOrderUseCase {
    Order createOrder(PurchaseOrder newOrder) throws Exception;
}
