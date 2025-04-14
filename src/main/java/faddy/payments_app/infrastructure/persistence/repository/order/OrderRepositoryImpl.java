package faddy.payments_app.infrastructure.persistence.repository.order;

import faddy.payments_app.application.port.out.repository.OrderRepository;
import faddy.payments_app.domain.order.Order;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryImpl implements OrderRepository {

    private final JpaOrderRepository jpaOrderRepository;

    @Override
    public Order findById(UUID id) {
        if (id == null) {
            throw new IllegalArgumentException("주문 ID는 null일 수 없습니다");
        }
        
        try {
            return jpaOrderRepository
                .findById(id)
                .orElseThrow(() -> new NoSuchElementException("주문을 찾을 수 없습니다: " + id));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("잘못된 형식의 주문 ID입니다: " + id, e);
        } catch (Exception e) {
            throw new RuntimeException("주문 조회 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    @Override
    public Order save(Order newOrder) {
        return jpaOrderRepository.save(newOrder);
    }

    @Override
    public boolean removeAll(UUID id) {
        return jpaOrderRepository.deleteById(id);
    }

    @Override
    public List<Order> findAll() {
        return jpaOrderRepository.findAll();
    }

}
