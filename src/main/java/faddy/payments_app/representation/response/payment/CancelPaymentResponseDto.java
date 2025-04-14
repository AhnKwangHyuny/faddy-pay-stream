package faddy.payments_app.representation.response.payment;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Slf4j
public class CancelPaymentResponseDto {
    private final boolean success;
    private final String message;

    // 생성자 추가
    public CancelPaymentResponseDto(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public static CancelPaymentResponseDto success() {
        return new CancelPaymentResponseDto(true, "결제 취소 성공했습니다.");
    }

    public static CancelPaymentResponseDto fail(String errorMessage) {
        return new CancelPaymentResponseDto(false, errorMessage);
    }

    public boolean isSuccess() {
        return success;
    }
}