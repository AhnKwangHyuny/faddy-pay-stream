package faddy.payments_app.infrastructure.persistence.repository.order;

import faddy.payments_app.infrastructure.persistence.repository.JpaBaseRepository;
import java.util.UUID;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaOrderRepository extends JpaBaseRepository<Order, UUID> {
}