using Context;
using Microsoft.EntityFrameworkCore;
using Repository;
using Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<UserContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Default"));
});

builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

app.Run();