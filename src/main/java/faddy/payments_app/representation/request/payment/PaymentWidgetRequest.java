package faddy.payments_app.representation.request.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentWidgetRequest {
    private String orderId;
    private String orderName;
    private int amount;
    private String customerName;
    private String customerEmail;
    private String customerMobilePhone;
}
