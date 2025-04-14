package faddy.payments_app.representation.request.order;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CancelOrder {
    private UUID orderId;
    private int[] itemIdxs;         // itemIdx 정보가 Empty면 전체 취소
    private String cancelReason;    // 취소 사유
    private String paymentKey;      // 결제 ID
    private int cancellationAmount; // 취소 금액

    public boolean hasItemIdx(){
        return this.getItemIdxs() != null && this.getItemIdxs().length > 0;
    }
    
    // orderId를 문자열로 설정하는 메서드 (JSON 역직렬화용)
    @JsonProperty("orderId")
    public void setOrderId(String orderIdStr) {
        try {
            if (orderIdStr == null || orderIdStr.isEmpty()) {
                throw new IllegalArgumentException("OrderId cannot be null or empty");
            }
            
            // 디버깅
            System.out.println("원본 orderIdStr: " + orderIdStr);
            
            // 0x 접두사가 있으면 제거
            if (orderIdStr.startsWith("0x")) {
                orderIdStr = orderIdStr.substring(2);
                System.out.println("0x 접두사 제거 후: " + orderIdStr);
            }
            
            // UUID 형식 검증 및 변환
            if (orderIdStr.length() == 32 && !orderIdStr.contains("-")) {
                // 하이픈이 없는 32자리 문자열을 표준 UUID 형식으로 변환
                String formattedUuid = orderIdStr.replaceAll(
                    "(.{8})(.{4})(.{4})(.{4})(.{12})",
                    "$1-$2-$3-$4-$5"
                ).toLowerCase(); // UUID는 소문자로 처리
                System.out.println("UUID 형식으로 변환: " + formattedUuid);
                this.orderId = UUID.fromString(formattedUuid);
            } else if (orderIdStr.contains("-")) {
                // 이미 하이픈이 있는 형식인 경우
                this.orderId = UUID.fromString(orderIdStr);
            } else {
                // 다른 형식이라면 오류 메시지 출력 후 변환 시도
                System.out.println("예상치 못한 UUID 형식, 변환 시도: " + orderIdStr);
                
                // 마지막 수단으로 원본 ID 사용
                try {
                    this.orderId = UUID.fromString(orderIdStr);
                } catch (Exception innerEx) {
                    // 원래 형식을 다시 직접 표준 형식으로 정리해보기
                    if (orderIdStr.length() >= 32) {
                        String clean = orderIdStr.replaceAll("[^a-fA-F0-9]", "").substring(0, 32);
                        String formatted = clean.replaceAll(
                            "(.{8})(.{4})(.{4})(.{4})(.{12})",
                            "$1-$2-$3-$4-$5"
                        ).toLowerCase();
                        System.out.println("최종 변환 시도: " + formatted);
                        this.orderId = UUID.fromString(formatted);
                    } else {
                        throw new IllegalArgumentException("너무 짧은 UUID 문자열: " + orderIdStr);
                    }
                }
            }
            
            System.out.println("최종 파싱된 UUID: " + this.orderId);
        } catch (IllegalArgumentException e) {
            System.err.println("UUID 변환 실패: " + orderIdStr);
            e.printStackTrace(); // 디버깅용 스택 트레이스 출력
            throw new IllegalArgumentException("주문 ID 형식 오류: " + orderIdStr, e);
        }
    }
}
