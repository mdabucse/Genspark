using DbContexFolder;
using Microsoft.EntityFrameworkCore;
using IInterfaces;
using Repository;
using Model;

var builder = WebApplication.CreateBuilder(args);


// Add Controllers
builder.Services.AddControllers();


// Swagger
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();


// DbContext
builder.Services.AddDbContext<MemberContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Default")
    );
});


// Dependency Injection
builder.Services.AddScoped<
    IGenericRepository<Member>,
    GeneralRepository<Member>
>();
builder.Services.AddScoped<
    IGenericRepository<Book>,
    GeneralRepository<Book>
>();


var app = builder.Build();


// Swagger Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();