package faddy.payments_app.representation.in.web;

import faddy.core.common.ApiResponse;
import faddy.payments_app.application.port.In.GetOrderInfoUseCase;
import faddy.payments_app.application.port.In.GetPaymentInfoUseCase;
import faddy.payments_app.application.port.In.PaymentFullfillUseCase;
import faddy.payments_app.domain.order.Order;
import faddy.payments_app.domain.payment.PaymentLedger;
import faddy.payments_app.representation.request.payment.PaymentApproved;
import faddy.payments_app.representation.request.payment.PaymentWidgetRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(
    origins = {"http://localhost:3000", "http://localhost:8080"}, 
    allowedHeaders = "*", 
    methods = {
        org.springframework.web.bind.annotation.RequestMethod.GET,
        org.springframework.web.bind.annotation.RequestMethod.POST,
        org.springframework.web.bind.annotation.RequestMethod.PUT,
        org.springframework.web.bind.annotation.RequestMethod.DELETE,
        org.springframework.web.bind.annotation.RequestMethod.OPTIONS
    },
    allowCredentials = "true"
)
public class PaymentController {
    private final PaymentFullfillUseCase paymentFullfillUseCase;
    private final GetPaymentInfoUseCase getPaymentInfoUseCase;
    private final GetOrderInfoUseCase getOrderInfoUseCase;
    private final org.springframework.core.env.Environment env;

    // 토스페이먼츠 결제 위젯에서 호출하는 성공 URL
    @GetMapping("/success")
    public ModelAndView paymentSuccess(@RequestParam(value = "paymentType", required = false) String paymentType, 
                                    @RequestParam(value = "orderId") String orderId,
                                    @RequestParam(value = "paymentKey") String paymentKey, 
                                    @RequestParam(value = "amount") String amount){
        log.info("Payment success callback - orderId: {}, paymentKey: {}, amount: {}", orderId, paymentKey, amount);
        
        // 프론트엔드로 리다이렉트 (성공 페이지로) - 절대 URL로 변경
        String frontendUrl = "http://localhost:3000/success";
        String redirectUrl = String.format("%s?paymentKey=%s&orderId=%s&amount=%s", 
                frontendUrl, paymentKey, orderId, amount);
        
        return new ModelAndView("redirect:" + redirectUrl);
    }

    // 토스페이먼츠 결제 위젯에서 호출하는 실패 URL
    @GetMapping("/fail")
    public ModelAndView paymentFail(@RequestParam(value = "message") String message,
                                 @RequestParam(value = "code", required = false) String code){
        log.info("Payment fail callback - message: {}, code: {}", message, code);
        
        // 프론트엔드로 리다이렉트 (실패 페이지로) - 절대 URL로 변경
        String frontendUrl = "http://localhost:3000/fail";
        String redirectUrl = String.format("%s?message=%s&code=%s",
                frontendUrl, message, code != null ? code : "ERROR");
        
        return new ModelAndView("redirect:" + redirectUrl);
    }

    // 결제 승인 요청 - 프론트엔드에서 호출
    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<String>> paymentConfirm(@RequestBody PaymentApproved paymentInfo) throws IOException {
        log.info("Payment confirmation request: {}", paymentInfo.toString());
        String result = paymentFullfillUseCase.paymentApproved(paymentInfo);
        
        if ("success".equals(result)) {
            return ResponseEntity.ok(ApiResponse.success(result));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.fail("결제 승인에 실패했습니다."));
        }
    }
    
    // GET 요청 처리 추가 - 405 Method Not Allowed 대신 명확한 메시지 반환
    @GetMapping("/confirm")
    public ResponseEntity<ApiResponse<String>> confirmPaymentGet() {
        log.info("GET request received for /confirm endpoint - returning error message");
        return ResponseEntity.status(org.springframework.http.HttpStatus.METHOD_NOT_ALLOWED)
            .body(ApiResponse.fail("GET 메서드는 지원하지 않습니다. 결제 승인은 POST 요청으로만 가능합니다."));
    }

    // 결제 정보 조회 API
    @GetMapping("/api/payments/{paymentKey}")
    public ResponseEntity<ApiResponse<PaymentLedger>> getPaymentInfo(@PathVariable String paymentKey) {
        log.info("Get payment info request: {}", paymentKey);
        PaymentLedger paymentLedger = getPaymentInfoUseCase.getLatestPaymentInfoOnlyOne(paymentKey);
        
        if (paymentLedger != null) {
            return ResponseEntity.ok(ApiResponse.success(paymentLedger));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 결제 위젯 초기화 정보 제공 API
    @PostMapping("/api/payments/widget")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPaymentWidgetInfo(@RequestBody PaymentWidgetRequest request) {
        log.info("Payment widget initialization request: {}", request);
        
        // 하드코딩된 클라이언트 키 사용 (checkout.html과 일치)
        String clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
        log.info("Using client key: {}", clientKey);
        
        Map<String, Object> response = new HashMap<>();
        response.put("clientKey", clientKey);
        response.put("successUrl", "http://localhost:8080/success");
        response.put("failUrl", "http://localhost:8080/fail");
        response.put("amount", request.getAmount());
        response.put("orderId", request.getOrderId());
        response.put("orderName", request.getOrderName());
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    

    // 결제 체크아웃 페이지 - 주문 ID로부터 직접 접근
    @GetMapping("/payment/checkout/{orderId}")
    public String checkoutPageWithOrder(@PathVariable String orderId) {
        log.info("Checkout page requested for order ID: {}", orderId);
        
        try {
            UUID orderUUID = UUID.fromString(orderId);
            Order order = getOrderInfoUseCase.getOrderById(orderUUID);
            
            if (order != null) {
                log.info("Order found: {}", order);
                // 주문 정보 로깅 (객체 정보 확인)
                log.info("Order ID: {}, Name: {}, Phone: {}, Total Price: {}", 
                    order.getOrderId(), order.getName(), order.getPhoneNumber(), order.getTotalPrice());
            } else {
                log.warn("Order not found for ID: {}", orderId);
            }
        } catch (Exception e) {
            log.error("Error fetching order information: {}", e.getMessage(), e);
        }
        
        return "checkout"; // templates/checkout.html을 렌더링
    }
    
    // 기존 결제 체크아웃 페이지 (파라미터로 전달 방식)
    @GetMapping("/payment/checkout.html")
    public String checkoutPage() {
        log.info("Checkout page requested with query parameters");
        return "checkout"; // templates/checkout.html을 렌더링
    }
}