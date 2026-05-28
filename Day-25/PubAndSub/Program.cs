var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Register Subscribers
builder.Services.AddSingleton<EmailSubscriber>();
builder.Services.AddSingleton<SmsSubscriber>();

var app = builder.Build();

// Resolve subscribers to activate them
app.Services.GetService<EmailSubscriber>();
app.Services.GetService<SmsSubscriber>();

app.MapControllers();

app.Run();