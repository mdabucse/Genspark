# Publisher Subscriber and SignalR - Learning Notes

## 1. Publisher Subscriber Pattern

### Definition

Publisher Subscriber is an event-driven design pattern where:

* Publisher sends notifications/events
* Subscribers listen and react to those events

The publisher does not know who the subscribers are.

---

# 2. Core Concepts

## Delegate

Delegate defines the method signature.

```csharp
public delegate void Notify();
```

---

## Event

Event is used for communication between publisher and subscriber.

```csharp
public event Notify OnMessagePublished;
```

---

## Subscriber

Subscriber contains methods that execute when events occur.

---

# 3. Basic Publisher Subscriber Example

## Publisher

```csharp
using System;

public class Publisher
{
    public event Action<string> OnMessagePublished;

    public void Publish(string message)
    {
        Console.WriteLine($"Published: {message}");

        OnMessagePublished?.Invoke(message);
    }
}
```

---

## Subscriber

```csharp
using System;

public class Subscriber
{
    private readonly string _name;

    public Subscriber(string name)
    {
        _name = name;
    }

    public void ReceiveMessage(string message)
    {
        Console.WriteLine($"{_name} received: {message}");
    }
}
```

---

## Program

```csharp
class Program
{
    static void Main()
    {
        Publisher publisher = new Publisher();

        Subscriber sub1 = new Subscriber("Abu");
        Subscriber sub2 = new Subscriber("Rahim");

        publisher.OnMessagePublished += sub1.ReceiveMessage;
        publisher.OnMessagePublished += sub2.ReceiveMessage;

        publisher.Publish("Hello Developers");
    }
}
```

---

# 4. Subscribe and Unsubscribe

## Subscribe

```csharp
publisher.OnMessagePublished += sub1.ReceiveMessage;
```

---

## Unsubscribe

```csharp
publisher.OnMessagePublished -= sub1.ReceiveMessage;
```

---

# 5. Event Flow

```text
Publisher creates event
        ↓
Subscribers subscribe
        ↓
Publisher triggers event
        ↓
Subscribers receive notification
```

---

# 6. EventHandler<T> Pattern

## Event Arguments

```csharp
using System;

public class MessageEventArgs : EventArgs
{
    public string Message { get; set; }
}
```

---

## Publisher

```csharp
using System;

public class Publisher
{
    public event EventHandler<MessageEventArgs> MessagePublished;

    public void Publish(string message)
    {
        MessagePublished?.Invoke(
            this,
            new MessageEventArgs
            {
                Message = message
            });
    }
}
```

---

## Subscriber

```csharp
public class Subscriber
{
    public void HandleMessage(
        object sender,
        MessageEventArgs e)
    {
        Console.WriteLine(e.Message);
    }
}
```

---

# 7. Publisher Subscriber via APIs

## Architecture

```text
Client
   ↓
Publisher API
   ↓
Event Bus
   ↓
Subscribers
```

---

# 8. In-Memory Event Bus

## EventBus.cs

```csharp
using System;

public static class EventBus
{
    public static event Action<string> MessagePublished;

    public static void Publish(string message)
    {
        MessagePublished?.Invoke(message);
    }
}
```

---

# 9. API Subscribers

## Email Subscriber

```csharp
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
```

---

## SMS Subscriber

```csharp
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
```

---

# 10. Publisher API

## NotificationController.cs

```csharp
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    [HttpPost]
    public IActionResult PublishMessage(string message)
    {
        EventBus.Publish(message);

        return Ok("Message Published");
    }
}
```

---

# 11. Program.cs Registration

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddSingleton<EmailSubscriber>();
builder.Services.AddSingleton<SmsSubscriber>();

var app = builder.Build();

app.Services.GetService<EmailSubscriber>();
app.Services.GetService<SmsSubscriber>();

app.MapControllers();

app.Run();
```

---

# 12. API Testing

## Request

```http
POST http://localhost:5000/api/notification?message=Hello
```

---

# 13. SignalR

## Definition

SignalR is a real-time communication framework in ASP.NET Core that enables bidirectional communication between server and clients.

---

# 14. SignalR Features

* Real-time communication
* Automatic reconnect
* Multiple transport support
* WebSocket support
* Live updates

---

# 15. SignalR Architecture

```text
Client 1 ─┐
          │
Client 2 ─┼── SignalR Hub ── Server
          │
Client 3 ─┘
```

---

# 16. SignalR Installation

```bash
dotnet add package Microsoft.AspNetCore.SignalR
```

---

# 17. SignalR Hub

## ChatHub.cs

```csharp
using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync(
            "ReceiveMessage",
            user,
            message
        );
    }
}
```

---

# 18. Configure SignalR

## Program.cs

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

var app = builder.Build();

app.MapHub<ChatHub>("/chatHub");

app.Run();
```

---

# 19. SignalR Client

## HTML + JavaScript

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/7.0.5/signalr.min.js"></script>

<script>
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/chatHub")
        .build();

    connection.on("ReceiveMessage", (user, message) => {
        console.log(user + ": " + message);
    });

    connection.start();

    function sendMessage() {
        connection.invoke(
            "SendMessage",
            "Abu",
            "Hello"
        );
    }
</script>
```

---

# 20. SignalR Methods

## Send to All

```csharp
await Clients.All.SendAsync("ReceiveMessage");
```

---

## Send to Specific Client

```csharp
await Clients.Client(connectionId)
             .SendAsync("ReceiveMessage");
```

---

## Send to Group

```csharp
await Clients.Group("Developers")
             .SendAsync("ReceiveMessage");
```

---

## Send to Caller

```csharp
await Clients.Caller.SendAsync("ReceiveMessage");
```

---

# 21. Connection Lifecycle

## User Connected

```csharp
public override async Task OnConnectedAsync()
{
    Console.WriteLine(Context.ConnectionId);

    await base.OnConnectedAsync();
}
```

---

## User Disconnected

```csharp
public override async Task OnDisconnectedAsync(Exception? ex)
{
    await base.OnDisconnectedAsync(ex);
}
```

---

# 22. Groups in SignalR

## Add User to Group

```csharp
await Groups.AddToGroupAsync(
    Context.ConnectionId,
    "Admins"
);
```

---

# 23. Real-Time Use Cases

* Chat applications
* Notifications
* Live dashboards
* Multiplayer games
* IoT monitoring
* Banking alerts
* Collaboration tools

---

# 24. Message Brokers

## Common Technologies

* RabbitMQ
* Kafka
* Azure Service Bus
* SignalR

---

# 25. RabbitMQ Architecture

```text
Publisher API
      ↓
RabbitMQ Exchange
      ↓
Queue
      ↓
Subscriber Service
```

---

# 26. Advantages of Publisher Subscriber Pattern

* Loose coupling
* Scalability
* Better maintainability
* Asynchronous communication
* Multiple subscribers support

---

# 27. Recommended Learning Path

```text
1. Delegates
2. Events
3. Publisher Subscriber
4. Event Bus
5. SignalR
6. RabbitMQ
7. Kafka
8. Microservices Architecture
```
