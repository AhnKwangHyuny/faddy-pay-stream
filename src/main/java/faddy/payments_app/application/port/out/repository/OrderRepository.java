package faddy.payments_app.application.port.out.repository;

import java.util.UUID;
import org.springframework.core.annotation.Order;

public interface OrderRepository {
    Order findById(UUID id);
    Order save(Order newOrder);
    boolean removeAll(UUID id);
}
