using Azure.Identity;
using Azure.Storage.Blobs;


var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddConsole();

builder.WebHost.ConfigureKestrel(options =>
{
    var portValue = Environment.GetEnvironmentVariable("PORT");
    if (!string.IsNullOrWhiteSpace(portValue) && int.TryParse(portValue, out var port))
    {
        options.ListenAnyIP(port);
    }
});

var keyVaultName = builder.Configuration["KeyVaultName"];
if (!string.IsNullOrWhiteSpace(keyVaultName))
{
    var keyVaultUri = new Uri($"https://{keyVaultName}.vault.azure.net/");
    try
    {
        builder.Configuration.AddAzureKeyVault(
            keyVaultUri,
            new DefaultAzureCredential());
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Warning: Azure Key Vault configuration failed. {ex.Message}");
    }
}

var blobConnectionString = builder.Configuration["BlobStorageConnectionString"];
if (string.IsNullOrWhiteSpace(blobConnectionString))
{
    throw new InvalidOperationException(
        "Missing BlobStorageConnectionString. Set this value as an App Setting or in Azure Key Vault.");
}

builder.Services.AddSingleton(_ => new BlobServiceClient(blobConnectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();

app.MapControllers();

app.Run();