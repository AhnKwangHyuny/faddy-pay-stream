package faddy.payments_app.infrastructure.persistence.repository.order;


import faddy.payments_app.domain.order.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaOrderItemRepository extends JpaRepository<OrderItem, Long> {

}
