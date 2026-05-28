using System;

public static class EventBus
{
    // Global Event
    public static event Action<string> MessagePublished;

    // Publish Method
    public static void Publish(string message)
    {
        MessagePublished?.Invoke(message);
    }
}