public class SmsSubscriber
{
    public SmsSubscriber()
    {
        EventBus.MessagePublished += HandleMessage;
    }

    private void HandleMessage(string message)
    {
        Console.WriteLine($"SMS Sent: {message}");
    }
}