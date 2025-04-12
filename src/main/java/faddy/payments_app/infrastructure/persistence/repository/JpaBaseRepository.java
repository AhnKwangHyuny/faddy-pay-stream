package faddy.payments_app.infrastructure.persistence.repository;

import faddy.payments_app.domain.order.Order;
import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.Repository;

@NoRepositoryBean
public interface JpaBaseRepository<T, ID> extends Repository<T, ID> {

    Optional<T> findById(ID id);
    <S extends T> T save(T entity);
    boolean deleteById(ID id);
    List<T> findAll();
}
