using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS to allow Angular dev server and Nginx proxy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

// Health Check Endpoint (Required by Step 25/26 of Lab manual)
app.MapGet("/api/health", () => Results.Ok(new 
{ 
    status = "Healthy", 
    message = "Weather API is running smoothly on .NET 8.", 
    timestamp = DateTime.UtcNow 
}));

// Weather Endpoint (Supports query param 'city', default to New York)
app.MapGet("/api/weather", (string? city) =>
{
    var cityName = string.IsNullOrWhiteSpace(city) ? "New York" : city.Trim();
    var weather = GetWeatherDataForCity(cityName);
    return Results.Ok(weather);
});

// Root welcome message
app.MapGet("/", () => Results.Ok(new 
{ 
    message = "Welcome to the Full-Stack Lab Weather API. Use /api/weather or /api/health endpoints." 
}));

app.Run();

// In-Memory Realistic Weather Data generator
WeatherResponse GetWeatherDataForCity(string city)
{
    var normalizedCity = city.ToLowerInvariant();
    var today = DateTime.Today;

    // Custom preset weather profiles for popular cities
    if (normalizedCity.Contains("london"))
    {
        return new WeatherResponse
        {
            City = "London",
            Country = "United Kingdom",
            Current = new CurrentWeather
            {
                TempC = 15,
                FeelsLikeC = 14,
                Humidity = 82,
                WindKmh = 19.5,
                Condition = "Rainy",
                Description = "Light rain and cool breeze"
            },
            Forecast = new List<ForecastDay>
            {
                new() { Date = today.AddDays(1).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(1).DayOfWeek.ToString(), MinTempC = 11, MaxTempC = 16, Condition = "Rainy", Humidity = 85 },
                new() { Date = today.AddDays(2).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(2).DayOfWeek.ToString(), MinTempC = 12, MaxTempC = 17, Condition = "Cloudy", Humidity = 78 },
                new() { Date = today.AddDays(3).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(3).DayOfWeek.ToString(), MinTempC = 10, MaxTempC = 15, Condition = "Rainy", Humidity = 90 },
                new() { Date = today.AddDays(4).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(4).DayOfWeek.ToString(), MinTempC = 9, MaxTempC = 14, Condition = "Cloudy", Humidity = 75 },
                new() { Date = today.AddDays(5).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(5).DayOfWeek.ToString(), MinTempC = 11, MaxTempC = 16, Condition = "Sunny", Humidity = 65 }
            }
        };
    }
    else if (normalizedCity.Contains("tokyo"))
    {
        return new WeatherResponse
        {
            City = "Tokyo",
            Country = "Japan",
            Current = new CurrentWeather
            {
                TempC = 22,
                FeelsLikeC = 22,
                Humidity = 60,
                WindKmh = 12.0,
                Condition = "Sunny",
                Description = "Clear sunny skies"
            },
            Forecast = new List<ForecastDay>
            {
                new() { Date = today.AddDays(1).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(1).DayOfWeek.ToString(), MinTempC = 16, MaxTempC = 24, Condition = "Sunny", Humidity = 55 },
                new() { Date = today.AddDays(2).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(2).DayOfWeek.ToString(), MinTempC = 17, MaxTempC = 23, Condition = "Cloudy", Humidity = 62 },
                new() { Date = today.AddDays(3).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(3).DayOfWeek.ToString(), MinTempC = 15, MaxTempC = 21, Condition = "Rainy", Humidity = 80 },
                new() { Date = today.AddDays(4).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(4).DayOfWeek.ToString(), MinTempC = 14, MaxTempC = 22, Condition = "Sunny", Humidity = 50 },
                new() { Date = today.AddDays(5).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(5).DayOfWeek.ToString(), MinTempC = 15, MaxTempC = 23, Condition = "Sunny", Humidity = 52 }
            }
        };
    }
    else if (normalizedCity.Contains("sydney"))
    {
        return new WeatherResponse
        {
            City = "Sydney",
            Country = "Australia",
            Current = new CurrentWeather
            {
                TempC = 18,
                FeelsLikeC = 18,
                Humidity = 70,
                WindKmh = 24.1,
                Condition = "Windy",
                Description = "Partly cloudy and windy"
            },
            Forecast = new List<ForecastDay>
            {
                new() { Date = today.AddDays(1).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(1).DayOfWeek.ToString(), MinTempC = 13, MaxTempC = 19, Condition = "Cloudy", Humidity = 68 },
                new() { Date = today.AddDays(2).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(2).DayOfWeek.ToString(), MinTempC = 12, MaxTempC = 18, Condition = "Sunny", Humidity = 58 },
                new() { Date = today.AddDays(3).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(3).DayOfWeek.ToString(), MinTempC = 14, MaxTempC = 20, Condition = "Sunny", Humidity = 60 },
                new() { Date = today.AddDays(4).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(4).DayOfWeek.ToString(), MinTempC = 13, MaxTempC = 19, Condition = "Rainy", Humidity = 75 },
                new() { Date = today.AddDays(5).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(5).DayOfWeek.ToString(), MinTempC = 11, MaxTempC = 17, Condition = "Windy", Humidity = 62 }
            }
        };
    }
    else if (normalizedCity.Contains("paris"))
    {
        return new WeatherResponse
        {
            City = "Paris",
            Country = "France",
            Current = new CurrentWeather
            {
                TempC = 19,
                FeelsLikeC = 19,
                Humidity = 65,
                WindKmh = 14.5,
                Condition = "Cloudy",
                Description = "Overcast sky with mild temperatures"
            },
            Forecast = new List<ForecastDay>
            {
                new() { Date = today.AddDays(1).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(1).DayOfWeek.ToString(), MinTempC = 14, MaxTempC = 21, Condition = "Cloudy", Humidity = 60 },
                new() { Date = today.AddDays(2).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(2).DayOfWeek.ToString(), MinTempC = 13, MaxTempC = 20, Condition = "Rainy", Humidity = 78 },
                new() { Date = today.AddDays(3).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(3).DayOfWeek.ToString(), MinTempC = 11, MaxTempC = 18, Condition = "Sunny", Humidity = 55 },
                new() { Date = today.AddDays(4).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(4).DayOfWeek.ToString(), MinTempC = 12, MaxTempC = 19, Condition = "Sunny", Humidity = 58 },
                new() { Date = today.AddDays(5).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(5).DayOfWeek.ToString(), MinTempC = 13, MaxTempC = 21, Condition = "Cloudy", Humidity = 64 }
            }
        };
    }
    else if (normalizedCity.Contains("cairo"))
    {
        return new WeatherResponse
        {
            City = "Cairo",
            Country = "Egypt",
            Current = new CurrentWeather
            {
                TempC = 34,
                FeelsLikeC = 36,
                Humidity = 35,
                WindKmh = 18.0,
                Condition = "Sunny",
                Description = "Hot and dry, completely clear skies"
            },
            Forecast = new List<ForecastDay>
            {
                new() { Date = today.AddDays(1).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(1).DayOfWeek.ToString(), MinTempC = 24, MaxTempC = 35, Condition = "Sunny", Humidity = 30 },
                new() { Date = today.AddDays(2).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(2).DayOfWeek.ToString(), MinTempC = 23, MaxTempC = 36, Condition = "Sunny", Humidity = 32 },
                new() { Date = today.AddDays(3).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(3).DayOfWeek.ToString(), MinTempC = 25, MaxTempC = 37, Condition = "Sunny", Humidity = 28 },
                new() { Date = today.AddDays(4).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(4).DayOfWeek.ToString(), MinTempC = 26, MaxTempC = 35, Condition = "Sunny", Humidity = 31 },
                new() { Date = today.AddDays(5).ToString("yyyy-MM-dd"), DayOfWeek = today.AddDays(5).DayOfWeek.ToString(), MinTempC = 24, MaxTempC = 34, Condition = "Sunny", Humidity = 35 }
            }
        };
    }
    else // Default: New York or any other searched city (generates randomized but realistic weather)
    {
        var displayCity = char.ToUpper(city[0]) + city.Substring(1).ToLower();
        var seed = city.GetHashCode();
        var rand = new Random(seed);
        var mainConditions = new[] { "Sunny", "Cloudy", "Rainy", "Snowy", "Stormy", "Windy" };
        var randomCondition = mainConditions[rand.Next(mainConditions.Length)];

        int baseTemp = randomCondition switch
        {
            "Sunny" => 27,
            "Cloudy" => 17,
            "Rainy" => 13,
            "Snowy" => -3,
            "Stormy" => 20,
            _ => 15
        };

        var descriptions = randomCondition switch
        {
            "Sunny" => "Mainly sunny and warm",
            "Cloudy" => "Overcast sky, grey day",
            "Rainy" => "Steady rain showers",
            "Snowy" => "Light snowfall and freezing conditions",
            "Stormy" => "Thunderstorms and strong gusts",
            _ => "Breezy and pleasant"
        };

        return new WeatherResponse
        {
            City = displayCity,
            Country = "United States",
            Current = new CurrentWeather
            {
                TempC = baseTemp + rand.Next(-3, 4),
                FeelsLikeC = baseTemp + rand.Next(-4, 2),
                Humidity = rand.Next(40, 95),
                WindKmh = Math.Round(rand.NextDouble() * 30 + 5, 1),
                Condition = randomCondition,
                Description = descriptions
            },
            Forecast = Enumerable.Range(1, 5).Select(i =>
            {
                var fDate = today.AddDays(i);
                var fCond = mainConditions[rand.Next(mainConditions.Length)];
                int fBaseTemp = fCond switch
                {
                    "Sunny" => 25,
                    "Cloudy" => 16,
                    "Rainy" => 12,
                    "Snowy" => -4,
                    "Stormy" => 18,
                    _ => 14
                };
                int minT = fBaseTemp + rand.Next(-5, 0);
                int maxT = fBaseTemp + rand.Next(1, 6);
                return new ForecastDay
                {
                    Date = fDate.ToString("yyyy-MM-dd"),
                    DayOfWeek = fDate.DayOfWeek.ToString(),
                    MinTempC = minT,
                    MaxTempC = maxT,
                    Condition = fCond,
                    Humidity = rand.Next(45, 90)
                };
            }).ToList()
        };
    }
}

public class WeatherResponse
{
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public CurrentWeather Current { get; set; } = new();
    public List<ForecastDay> Forecast { get; set; } = new();
}

public class CurrentWeather
{
    public int TempC { get; set; }
    public int TempF => 32 + (int)(TempC / 0.5556);
    public int FeelsLikeC { get; set; }
    public int FeelsLikeF => 32 + (int)(FeelsLikeC / 0.5556);
    public int Humidity { get; set; }
    public double WindKmh { get; set; }
    public string Condition { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class ForecastDay
{
    public string Date { get; set; } = string.Empty;
    public string DayOfWeek { get; set; } = string.Empty;
    public int MinTempC { get; set; }
    public int MinTempF => 32 + (int)(MinTempC / 0.5556);
    public int MaxTempC { get; set; }
    public int MaxTempF => 32 + (int)(MaxTempC / 0.5556);
    public string Condition { get; set; } = string.Empty;
    public int Humidity { get; set; }
}
