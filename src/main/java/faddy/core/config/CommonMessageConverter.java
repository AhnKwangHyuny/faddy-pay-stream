package faddy.core.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import faddy.core.common.ApiResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

@Component
@Slf4j
@Order(Ordered.HIGHEST_PRECEDENCE) // Convert 구현체 우선순위 획득
@RequiredArgsConstructor
public class CommonMessageConverter extends AbstractHttpMessageConverter<ApiResponse<Object>> {

    private final ObjectMapper objectMapper;

    @Override
    protected boolean supports(Class<?> clazz) {
        log.info("AbstractHttpMessageConverter supports :: {}", clazz);
        return clazz.equals(ApiResponse.class) || clazz.isPrimitive() || clazz.equals(String.class); //원시형, string , apiResponse<primitive>

    }

    @Override
    protected ApiResponse<Object> readInternal(Class<? extends ApiResponse<Object>> clazz,
        HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
        throw new UnsupportedOperationException("this converter can only support writing operation");
    }

    @Override
    protected void writeInternal(ApiResponse<Object> objectApiResponse,
        HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {

        String responseMessage = objectMapper.writeValueAsString(objectApiResponse);

        StreamUtils.copy(responseMessage.getBytes(StandardCharsets.UTF_8) , outputMessage.getBody());


    }

    @Override
    public List<MediaType> getSupportedMediaTypes() {
        return Collections.singletonList(MediaType.APPLICATION_JSON);
    }
}
