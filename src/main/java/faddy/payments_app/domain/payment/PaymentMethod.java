package faddy.payments_app.domain.payment;

import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.Getter;

@Getter
public enum PaymentMethod {
    CARD("카드");

    private final String methodName;

    private static final Map<String,String> methodMap = Collections.unmodifiableMap(
        Stream.of(values()).collect(Collectors.toMap(PaymentMethod::getMethodName, PaymentMethod::name))
    );

    public static PaymentMethod fromMethodName(String methodName) {
        return PaymentMethod.valueOf(methodMap.get(methodName));
    }

    PaymentMethod(String name) {
        this.methodName = name;
    }
}