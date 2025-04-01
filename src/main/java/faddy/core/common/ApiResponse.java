package faddy.core.common;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ApiResponse<T> {
    private final String message;
    private final T data;
    private final LocalDateTime timestamp;

    public ApiResponse(String message , T data) {
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }
}