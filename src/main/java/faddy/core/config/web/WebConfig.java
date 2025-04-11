package faddy.core.config.web;

import java.util.List;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOriginPatterns(
                "http://localhost:*",       // 모든 localhost 포트
                "http://127.0.0.1:*",       // 모든 127.0.0.1 포트
                "http://192.168.*.*:*",     // 로컬 네트워크 192.168.x.x
                "http://172.16.*.*:*",      // 로컬 네트워크 172.16.x.x
                "http://10.*.*.*:*"         // 로컬 네트워크 10.x.x.x
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        WebMvcConfigurer.super.configureMessageConverters(converters);
    }
}