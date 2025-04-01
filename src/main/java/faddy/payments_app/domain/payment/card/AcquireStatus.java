package faddy.payments_app.domain.payment.card;

/**
 * acquireStatus string
 * 카드 결제의 매입 상태
 * - READY: 아직 매입 요청이 안 된 상태
 * - REQUESTED: 매입이 요청된 상태
 * - COMPLETED: 요청된 매입이 완료된 상태
 * - CANCEL_REQUESTED: 매입 취소가 요청된 상태
 * - CANCELED: 요청된 매입 취소가 완료된 상태
 */
public enum AcquireStatus {
    READY, REQUESTED, COMPLETED, CANCEL_REQUESTED, CANCELLED;
}