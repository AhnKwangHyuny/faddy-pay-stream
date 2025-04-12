package faddy.payments_app.representation.request.payment;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

/**
 * 토스페이먼츠 결제 승인 요청 객체
 * API 문서: https://docs.tosspayments.com/reference/js-sdk#%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8
 * 
 * 중요: 필드명이 정확히 API 명세와 일치해야 함
 * - orderId: 주문 ID
 * - amount: 결제 금액
 * - paymentKey: 결제 키
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentApproved {
    // 필드 순서가 중요할 수 있으므로 API 문서 순서대로 배치
    private String paymentKey;
    private String orderId;
    private Integer amount;
    
    @Override
    public String toString() {
        return "PaymentApproved{" +
                "paymentKey='" + paymentKey + '\'' +
                ", orderId='" + orderId + '\'' +
                ", amount=" + amount +
                '}';
    }
}
