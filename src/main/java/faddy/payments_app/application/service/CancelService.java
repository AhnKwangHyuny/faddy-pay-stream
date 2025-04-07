package faddy.payments_app.application.service;

import faddy.payments_app.application.port.In.PaymentCancelUseCase;
import faddy.payments_app.application.port.out.api.PaymentAPIs;
import faddy.payments_app.application.port.out.repository.PaymentLedgerRepository;
import faddy.payments_app.domain.order.Order;
import faddy.payments_app.domain.payment.PaymentLedger;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentCancel;
import faddy.payments_app.representation.request.order.CancelOrder;
import faddy.payments_app.representation.request.payment.PaymentCancel;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j
public class CancelService implements PaymentCancelUseCase {

    private final PaymentAPIs tossPayment;
    private final OrderService orderService;
    private final PaymentService paymentService;
    private final PaymentLedgerRepository paymentLedgerRepository;

    @Transactional
    @Override
    public boolean paymentCancel(CancelOrder cancelOrder) throws Exception {
        String paymentKey = cancelOrder.getPaymentKey();
        int cancellationAmount = cancelOrder.getCancellationAmount();
        Order wantedCancelOrder = orderService.getOrderById(cancelOrder.getOrderId());
        PaymentLedger paymentInfo = paymentService.getLatestPaymentInfoOnlyOne(paymentKey);

        if (wantedCancelOrder.isNotOrderStatusPurchaseDecision() &&
            paymentInfo.isCancellableAmountGreaterThan(cancellationAmount)) {
            ResponsePaymentCancel response = tossPayment.requestPaymentCancel(paymentKey, new PaymentCancel(cancelOrder.getCancelReason(), cancellationAmount));
            paymentLedgerRepository.save(response.toEntity());

            if (cancelOrder.hasItemIdx())
                wantedCancelOrder.orderCancel(cancelOrder.getItemIdxs());
            else
                wantedCancelOrder.orderAllCancel();
            return true;
        }

        throw new Exception("Not Enough CancellationAmount");
    }
}