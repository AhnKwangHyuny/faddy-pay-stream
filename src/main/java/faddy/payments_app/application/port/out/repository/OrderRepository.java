package faddy.payments_app.application.port.out.repository;

import faddy.payments_app.domain.order.Order;
import java.util.UUID;

public interface OrderRepository {
    Order findById(UUID id);
    Order save(Order newOrder);
    boolean removeAll(UUID id);
}
