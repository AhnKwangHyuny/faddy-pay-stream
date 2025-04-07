package faddy.payments_app.representation.request.order;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
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
}
