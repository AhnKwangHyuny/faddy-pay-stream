package faddy.payments_app.domain.payment.card;

import jakarta.persistence.AttributeConverter;

public class AcquireStatusConverter implements AttributeConverter<AcquireStatus, String> {
    @Override
    public String convertToDatabaseColumn(AcquireStatus acquireStatus) {
        return acquireStatus.name();
    }

    @Override
    public AcquireStatus convertToEntityAttribute(String s) {
        return AcquireStatus.valueOf(s);
    }
}