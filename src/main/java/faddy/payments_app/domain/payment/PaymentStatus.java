package faddy.payments_app.domain.payment;

/**
 * 결제 상태를 나타내는 데이터
 * - DONE: 인증된 결제수단 정보, 고객 정보로 요청한 결제가 승인된 상태
 * - PARTIAL_CANCELED: 승인된 결제가 부분 취소된 상태
 * - CANCELED: 승인된 결제가 취소된 상태
 * - SETTLEMENTS_REQUESTED: 정산이 요청된 상태
 * - SETTLEMENTS_COMPLETED: 정산이 완료된 상태
 * - SETTLEMENTS_CANCELED: 정산이 취소된 상태
 */
public enum PaymentStatus {
    DONE,
    PARTIAL_CANCELED,
    CANCELED,
    SETTLEMENTS_REQUESTED,
    SETTLEMENTS_COMPLETED,
    SETTLEMENTS_CANCELED
}