package faddy.payments_app.application.service;

import faddy.payments_app.application.port.In.PaymentSettlementsUseCase;
import faddy.payments_app.application.port.In.SendSettlementsInfoUseCase;
import faddy.payments_app.application.port.out.api.PaymentAPIs;
import faddy.payments_app.application.port.out.mq.Producer;
import faddy.payments_app.application.port.out.repository.PaymentLedgerRepository;
import faddy.payments_app.application.port.out.repository.SettlementRepository;
import faddy.payments_app.domain.settlements.PaymentSettlements;
import faddy.payments_app.infrastructure.out.mq.record$.RPaymentSettlements;
import faddy.payments_app.infrastructure.out.mq.record$.Settlements;
import faddy.payments_app.infrastructure.out.pg.toss.response.ResponsePaymentSettlements;
import faddy.payments_app.representation.request.payment.PaymentSettlement;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SettlementsService implements PaymentSettlementsUseCase , SendSettlementsInfoUseCase {

    private final static String SETTLEMENTS_TOPIC = "settlements";

    private final PaymentAPIs mockPayment;
    private final SettlementRepository settlementRepository;
    private final PaymentLedgerRepository paymentLedgerRepository;
    private final Producer<RPaymentSettlements> producer;

    @SneakyThrows
    @Override
    public void getPaymentSettlements() throws IOException {
        List<ResponsePaymentSettlements> response = mockPayment.requestPaymentSettlement(createPaymentSettlement());
        List<PaymentSettlements> settlementsHistories = response.stream()
            .map(ResponsePaymentSettlements::toEntity)
            .toList();
        settlementRepository.bulkInsert(settlementsHistories);
        paymentLedgerRepository.bulkInsert(
            settlementsHistories.stream().map(PaymentSettlements::toPaymentLedger)
                .toList()
        );
    }

    @Autowired
    public SettlementsService(
        @Qualifier("mockTossPayment") PaymentAPIs mockPayment,
        SettlementRepository settlementRepository,
        PaymentLedgerRepository paymentLedgerRepository,
        Producer<RPaymentSettlements> producer) {
        this.mockPayment = mockPayment;
        this.settlementRepository = settlementRepository;
        this.paymentLedgerRepository = paymentLedgerRepository;
        this.producer = producer;
    }

    private PaymentSettlement createPaymentSettlement() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String startDate = LocalDateTime.now(ZoneId.of("Asia/Seoul")).minusDays(3).format(formatter);
        String endDate = LocalDateTime.now(ZoneId.of("Asia/Seoul")).minusDays(1).format(formatter);
        return PaymentSettlement.builder()
            .startDate(startDate)
            .endDate(endDate)
            .page(1)
            .size(5000)
            .build();
    }

    @SneakyThrows
    @Override
    public boolean send() {
        List<ResponsePaymentSettlements> response = mockPayment.requestPaymentSettlement(createPaymentSettlement());
        List<PaymentSettlements> datum = response.stream()
            .map(ResponsePaymentSettlements::toEntity)
            .toList();
        RPaymentSettlements record = RPaymentSettlements.newBuilder()
            .setSettlements(datum.stream().map(data -> Settlements.newBuilder()
                .setId(data.getId())
                .setPaymentKey(data.getPaymentKey())
                .setTotalAmount(data.getTotalAmount())
                .setPayOutAmount(data.getPayOutAmount())
                .setCanceledAmount(data.getCanceledAmount())
                .setMethod(data.getMethod().toString())
                .setSoldDate(data.getSoldDate().toString())
                .setPaidOutDate(data.getPaidOutDate().toString())
                .build()
            ).toList())
            .build();
        producer.send(SETTLEMENTS_TOPIC, record);
        return true;
    }
}
