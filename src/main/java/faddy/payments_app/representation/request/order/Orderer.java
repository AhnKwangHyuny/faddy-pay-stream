package faddy.payments_app.representation.request.order;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class Orderer {

    @NotBlank
    private String name;

    @NotBlank
    private String phoneNumber;
}