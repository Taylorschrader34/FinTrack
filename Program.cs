using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using FinTrack.Data;
using FinTrack.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

var environment = builder.Environment;

var env = builder.Configuration.GetValue<string>("Environment");

switch (env)
{
    case "DEV":
        builder.Services.AddDbContext<ApiDbContext>(options =>
            options.UseInMemoryDatabase("FinTrackDb")
                .EnableSensitiveDataLogging());
        break;
    case "TEST":
        builder.Services.AddEntityFrameworkNpgsql()
            .AddDbContext<ApiDbContext>(opt =>
                opt.UseNpgsql(builder.Configuration.GetConnectionString("finTrackDbConnectionTest"))
                    .EnableSensitiveDataLogging());
        break;
    case "PROD":
        builder.Services.AddEntityFrameworkNpgsql()
            .AddDbContext<ApiDbContext>(opt =>
                opt.UseNpgsql(builder.Configuration.GetConnectionString("finTrackDbConnection"))
                    .EnableSensitiveDataLogging());
        break;
    default:
        throw new ArgumentException("Invalid environment value specified in appsettings.json");
}

var app = builder.Build();

if (env == "DEV")
{
    // Generate fake data and store in memory
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var dbContext = services.GetRequiredService<ApiDbContext>();

        dbContext.Database.EnsureCreated(); // Ensure the database is created

        // Adjust the parameters as needed
        FakeDataGenerator.GenerateFakeData(dbContext, 100, 50, 30, 200);
        //FakeDataGenerator.GenerateFakeData(dbContext, 0, 0, 0, 0);
        dbContext.SaveChanges(); // Save changes to persist fake data in memory
    }
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
