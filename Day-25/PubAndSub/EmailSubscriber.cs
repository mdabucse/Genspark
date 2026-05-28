public class EmailSubscriber
{
    public EmailSubscriber()
    {
        EventBus.MessagePublished += HandleMessage;
    }

    private void HandleMessage(string message)
    {
        Console.WriteLine($"Email Sent: {message}");
    }
}