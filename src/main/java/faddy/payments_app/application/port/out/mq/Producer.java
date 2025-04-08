package faddy.payments_app.application.port.out.mq;

public interface Producer<T> {
    boolean send(String topic, T record);
}