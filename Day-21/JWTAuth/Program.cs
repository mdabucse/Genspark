using Context;
using Microsoft.EntityFrameworkCore;
using Repository;
using Interfaces;
using Helpers;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// DATABASE CONFIGURATION
builder.Services.AddDbContext<UserContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Default"));
});


// JWT AUTHENTICATION
builder.Services.AddAuthentication(options =>
{
    // Defines default authentication scheme
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;

    // Defines default challenge scheme
    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;

})
.AddJwtBearer(opts =>
{
    opts.TokenValidationParameters =
        new TokenValidationParameters
        {
            // Validate token issuer
            ValidateIssuer = true,

            // Skip audience validation
            ValidateAudience = false,

            // Expected issuer value
            ValidIssuer = builder.Configuration["JWT:Issuer"],

            // Validate digital signature
            ValidateIssuerSigningKey = true,

            // Secret key used to validate JWT signature
            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        builder.Configuration["JWT:Key"]!
                    )
                ),

            // Validate token expiration
            ValidateLifetime = true
        };
});

// AUTHORIZATION
builder.Services.AddAuthorization();

// DEPENDENCY INJECTION
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<JwtTokenGenerator>();

// CONTROLLERS
builder.Services.AddControllers();
var app = builder.Build();

// MIDDLEWARE PIPELINE

// Enables JWT authentication middleware
app.UseAuthentication();

// Enables authorization middleware
app.UseAuthorization();

// MAP CONTROLLERS

app.MapControllers();

app.Run();