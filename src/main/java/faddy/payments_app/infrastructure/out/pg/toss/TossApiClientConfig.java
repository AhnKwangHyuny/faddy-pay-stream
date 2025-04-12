package faddy.payments_app.infrastructure.out.pg.toss;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;

@Configuration
@Slf4j
public class TossApiClientConfig {
    private String baseUrl;
    private final String secretKey;

    public TossApiClientConfig(org.springframework.core.env.Environment env) {
        this.baseUrl = env.getProperty("pg.tosspayments.baseUrl");
        this.secretKey = env.getProperty("pg.tosspayments.privateKey");
        
        log.info("Toss API initialized with baseUrl: {}", baseUrl);
        log.info("Property names for reference - baseUrl: pg.tosspayments.baseUrl, secretKey: pg.tosspayments.privateKey");
    }

    @Bean
    public OkHttpClient okHttpClient() {
        log.info("토스페이먼츠 API 인증 설정 초기화");
        
        // 문서에서 제공하는 위젯용 시크릿 키로 하드코딩
        final String widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
        
        // 설정된 키와 비교 출력
        log.info("설정된 시크릿 키: {}", secretKey);
        log.info("위젯용 시크릿 키 사용: {}", widgetSecretKey);
        
        // 위젯용 시크릿 키 사용
        final String effectiveKey = widgetSecretKey;
        
        // 토스페이먼츠 API 인증 방식: 시크릿 키 + 콜론을 Base64로 인코딩
        final String keyWithColon = effectiveKey.endsWith(":") ? effectiveKey : effectiveKey + ":";
        
        // 인코딩 과정 출력 (디버깅 용)
        log.info("시크릿 키 형식 확인: {}", effectiveKey.startsWith("test_gsk_") ? "위젯용 키 형식 맞음" : "위젯용 키 형식 아님");
        log.info("토스페이먼츠 API 사용법: 위젯 연동에는 test_gsk_ 접두사 키를, 일반 API에는 test_sk_ 접두사 키를 사용해야 합니다");
        log.info("Base64 인코딩 전 형식: [시크릿 키]:");
        
        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encodedBytes = encoder.encode(keyWithColon.getBytes(StandardCharsets.UTF_8));
        String authorization = "Basic " + new String(encodedBytes);
        
        // 디버깅을 위한 Base64 인코딩 값 출력
        log.info("Authorization 헤더: Basic ***[마스킹된 인코딩 값]***");
        
        // 인터셉터가 있는 OkHttpClient 구성
        return new OkHttpClient.Builder()
            .connectTimeout(20, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .addInterceptor(chain -> {
                Request originalRequest = chain.request();
                
                // 모든 요청에 인증 및 콘텐츠 타입 헤더 추가
                Request newRequest = originalRequest.newBuilder()
                    .header("Authorization", authorization)
                    .header("Content-Type", "application/json")
                    .build();
                
                // 요청 URL 로깅
                log.info("Sending request to: {}", originalRequest.url());
                
                // 요청 헤더 로깅 (민감 정보 제외)
                log.info("Request headers: Content-Type={}", newRequest.header("Content-Type"));
                
                // 요청 전송 및 응답 반환
                return chain.proceed(newRequest);
            })
            .build();
    }

    @Bean
    public Retrofit retrofit(OkHttpClient okHttpClient) {
        if (baseUrl == null || baseUrl.isEmpty()) {
            throw new IllegalStateException("토스페이먼츠 API 기본 URL이 설정되지 않았습니다. application.yml을 확인하세요.");
        }
        
        // URL 형식 확인
        if (!baseUrl.endsWith("/")) {
            log.warn("baseUrl에 마지막 슬래시(/)가 없어 추가합니다: {}", baseUrl);
            baseUrl = baseUrl + "/";
        }
        
        log.info("토스페이먼츠 API URL: {}", baseUrl);
        
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        
        // JSON 직렬화 설정 추가
        objectMapper.configure(com.fasterxml.jackson.databind.SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        objectMapper.setSerializationInclusion(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL);

        return new Retrofit.Builder()
            .baseUrl(baseUrl)
            .addConverterFactory(JacksonConverterFactory.create(objectMapper))
            .client(okHttpClient)
            .build();
    }

    @Bean
    public TossPaymentAPIs tossPaymentAPIs(Retrofit retrofit) {
        return retrofit.create(TossPaymentAPIs.class);
    }

}
