using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using FinTrack.Data;
using FinTrack.Helpers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

var environment = builder.Environment;

if (environment.IsDevelopment())
{
    builder.Services.AddDbContext<ApiDbContext>(options =>
        options.UseInMemoryDatabase("FinTrackDb")
        .EnableSensitiveDataLogging()); // Use in-memory database in development
}
else
{
    builder.Services.AddEntityFrameworkNpgsql()
            .AddDbContext<ApiDbContext>(opt =>
            opt.UseNpgsql(builder.Configuration.GetConnectionString("finTrackDbConnection"))
            .EnableSensitiveDataLogging());
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // Generate fake data and store in memory
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var dbContext = services.GetRequiredService<ApiDbContext>();

        dbContext.Database.EnsureCreated(); // Ensure the database is created

        // Adjust the parameters as needed
        FakeDataGenerator.GenerateFakeData(dbContext, 100, 50, 200);
        //FakeDataGenerator.GenerateFakeData(dbContext, 0, 0, 0);
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
