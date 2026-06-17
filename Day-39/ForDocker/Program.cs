using Npgsql;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

string connString =
    "Host=postgres-db;Port=5432;Database=customerdb;Username=postgres;Password=postgres";

// Create table
app.MapGet("/init", async () =>
{
    await using var conn = new NpgsqlConnection(connString);
    await conn.OpenAsync();

    var cmd = new NpgsqlCommand(@"
        CREATE TABLE IF NOT EXISTS customers(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100)
        );", conn);

    await cmd.ExecuteNonQueryAsync();

    return "Table Created";
});

// Insert data
app.MapGet("/insert", async () =>
{
    await using var conn = new NpgsqlConnection(connString);
    await conn.OpenAsync();

    var cmd = new NpgsqlCommand(
        "INSERT INTO customers(name) VALUES('Abubakkar')",
        conn);

    await cmd.ExecuteNonQueryAsync();

    return "Data Inserted Successfully";
});

// Read data
app.MapGet("/customers", async () =>
{
    var customers = new List<object>();

    await using var conn = new NpgsqlConnection(connString);
    await conn.OpenAsync();

    var cmd = new NpgsqlCommand(
        "SELECT * FROM customers",
        conn);

    var reader = await cmd.ExecuteReaderAsync();

    while (await reader.ReadAsync())
    {
        customers.Add(new
        {
            Id = reader.GetInt32(0),
            Name = reader.GetString(1)
        });
    }

    return customers;
});

app.Run();