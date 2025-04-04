package faddy.payments_app.application.port.In;

import faddy.payments_app.domain.order.Order;
import faddy.payments_app.representation.request.order.PurchaseOrder;

public interface CreateNewOrderUseCase {
    Order createOrder(PurchaseOrder newOrder) throws Exception;
}
