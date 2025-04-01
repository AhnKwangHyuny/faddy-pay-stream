package faddy.payments_app.representation.request.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrderItem {
    @Min(1)
    private int itemIdx;

    private UUID productId;

    @NotBlank
    private String productName;

    private int price;

    @Min(1)
    private int quantity;

    private int amounts;
}
