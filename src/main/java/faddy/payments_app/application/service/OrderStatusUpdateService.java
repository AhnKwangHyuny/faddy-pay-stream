package faddy.payments_app.application.service;

import faddy.payments_app.domain.order.Order;
import faddy.payments_app.representation.request.order.CancelOrder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderStatusUpdateService {
    public void updateOrderStatus(Order wantedCancelOrder, CancelOrder cancelOrder) {
        try {
            if (cancelOrder.hasItemIdx()) {
                wantedCancelOrder.orderCancel(cancelOrder.getItemIdxs());
            } else {
                wantedCancelOrder.orderAllCancel();
            }
        } catch (Exception e) {
            throw new RuntimeException("주문 상태 업데이트 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
