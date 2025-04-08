package faddy.payments_app.infrastructure.out.mq;

import faddy.payments_app.application.port.out.repository.SettlementRepository;
import faddy.payments_app.domain.payment.PaymentMethod;
import faddy.payments_app.domain.payment.PaymentStatus;
import faddy.payments_app.domain.settlements.PaymentSettlements;
import faddy.payments_app.infrastructure.out.mq.record$.RPaymentSettlements;
import faddy.payments_app.infrastructure.out.mq.record$.Settlements;
import java.sql.Date;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumer {
    private final static String SETTLEMENTS_TOPIC = "settlements";
    private final SettlementRepository paymentSettlementsRepository;

    // record 를 수신하기 위한 consumer 설정
    @KafkaListener(topics = SETTLEMENTS_TOPIC)
    public void receive(ConsumerRecord<String, RPaymentSettlements> consumerRecord) {

        RPaymentSettlements payload = consumerRecord.value();
        log.info("received payload = {}", payload.getSettlements().get(0).getPaymentKey());

        List<Settlements> records = payload.getSettlements();
        List<PaymentSettlements> rows = records.stream()
            .map(record -> PaymentSettlements.builder()
                .paymentKey(record.getPaymentKey())
                .method(PaymentMethod.valueOf(record.getMethod()))
                .paymentStatus(PaymentStatus.valueOf("SETTLEMENTS_REQUESTED"))
                .totalAmount(record.getTotalAmount())
                .payOutAmount(record.getPayOutAmount())
                .canceledAmount(record.getCanceledAmount())
                .soldDate(Date.valueOf(record.getSoldDate()))
                .paidOutDate(Date.valueOf(record.getPaidOutDate()))
                .build()
            )
            .toList();
        paymentSettlementsRepository.bulkInsert(rows);
    }
}