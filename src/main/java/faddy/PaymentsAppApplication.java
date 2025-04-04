package faddy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PaymentsAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(PaymentsAppApplication.class, args);
	}

}
