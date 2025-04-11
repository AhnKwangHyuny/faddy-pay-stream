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
    private final String baseUrl;
    private final String secretKey;

    public TossApiClientConfig(org.springframework.core.env.Environment env) {
        this.baseUrl = env.getProperty("pg.tosspayments.baseUrl");
        this.secretKey = env.getProperty("pg.tosspayments.privateKey");
        
        log.info("Toss API initialized with baseUrl: {}", baseUrl);
        log.info("Property names for reference - baseUrl: pg.tosspayments.baseUrl, secretKey: pg.tosspayments.privateKey");
    }

    @Bean
    public OkHttpClient okHttpClient() {
        // 시크릿 키 로깅 (트러블슈팅용)
        log.info("Using secretKey: {}", secretKey);
        
        // 시크릿 키는 이미 콜론이 포함되어 있으므로 추가로 붙이지 않음
        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encodedBytes = encoder.encode(secretKey.getBytes(StandardCharsets.UTF_8));
        String authorizations = "Basic " + new String(encodedBytes);
        log.info("Authorization key format: Basic [Base64-encoded-secret-key]");

        return new OkHttpClient.Builder()
            .connectTimeout(20, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .addInterceptor(chain -> {
                Request request = chain.request().newBuilder()
                    .addHeader("Authorization", authorizations).build();
                return chain.proceed(request);
            })
            .build();
    }

    @Bean
    public Retrofit retrofit(OkHttpClient okHttpClient) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

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
