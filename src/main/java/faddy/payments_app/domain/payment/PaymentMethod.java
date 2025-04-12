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

    // 토스페이먼츠 결제 방식과 매핑을 위한 상수 추가
    private static final Map<String, PaymentMethod> TOSS_METHOD_MAP = Map.of(
        "카드", CARD,
        "CARD", CARD,
        "card", CARD,
        "신용카드", CARD
    );

    /**
     * 결제 방식 문자열로부터 PaymentMethod Enum 값을 반환
     * 
     * @param methodName 결제 방식 이름 (토스페이먼츠에서 전달하는 값)
     * @return 해당하는 PaymentMethod Enum 값 (없으면 기본값 CARD 반환)
     */
    public static PaymentMethod fromMethodName(String methodName) {
        if (methodName == null) {
            // 메서드명이 null이면 기본값으로 CARD 반환
            System.out.println("결제 방식이 null입니다. 기본값 CARD로 처리합니다.");
            return CARD;
        }
        
        // 토스페이먼츠 메서드명으로 직접 매핑 시도
        if (TOSS_METHOD_MAP.containsKey(methodName)) {
            return TOSS_METHOD_MAP.get(methodName);
        }
        
        // 기존 방식으로 매핑 시도
        String enumName = methodMap.get(methodName);
        if (enumName != null) {
            return PaymentMethod.valueOf(enumName);
        }
        
        // 어떤 매핑도 없으면 기본값 반환
        System.out.println("알 수 없는 결제 방식입니다: " + methodName + ", 기본값 CARD로 처리합니다.");
        return CARD;
    }

    PaymentMethod(String name) {
        this.methodName = name;
    }
}