using Bookstore.API.Data;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var sqliteConnectionString = ResolveSqliteConnectionString(builder.Configuration, builder.Environment);
builder.Services.AddDbContext<BookDbContext>(options =>
    options.UseSqlite(sqliteConnectionString));

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
            return;
        }

        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

CopyBundledDatabaseIfNeeded(app.Environment, sqliteConnectionString);

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BookDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapGet("/", () =>
    Results.Json(new
    {
        service = "Bookstore API",
        endpoints = new Dictionary<string, string>
        {
            ["allBooks"] = "/Bookstore/AllBooks",
            ["categories"] = "/Bookstore/BookCategories",
            ["weather"] = "/WeatherForecast",
        },
    }));

app.MapControllers();

app.Run();

static string ResolveSqliteConnectionString(IConfiguration configuration, IWebHostEnvironment environment)
{
    var configured = configuration.GetConnectionString("BookConnection");
    if (string.IsNullOrWhiteSpace(configured))
    {
        configured = "Data Source=Bookstore.sqlite";
    }

    var csb = new SqliteConnectionStringBuilder(configured);
    var fileName = Path.GetFileName(csb.DataSource);
    if (string.IsNullOrEmpty(fileName))
    {
        fileName = "Bookstore.sqlite";
    }

    if (Path.IsPathRooted(csb.DataSource))
    {
        return configured;
    }

    var home = Environment.GetEnvironmentVariable("HOME");
    var dataRoot = !string.IsNullOrEmpty(home)
        ? Path.Combine(home, "data")
        : Path.Combine(environment.ContentRootPath, "data");

    Directory.CreateDirectory(dataRoot);
    csb.DataSource = Path.Combine(dataRoot, fileName);
    return csb.ConnectionString;
}

static void CopyBundledDatabaseIfNeeded(IWebHostEnvironment env, string sqliteConnectionString)
{
    var csb = new SqliteConnectionStringBuilder(sqliteConnectionString);
    var targetPath = csb.DataSource;
    if (string.IsNullOrEmpty(targetPath) || File.Exists(targetPath))
    {
        return;
    }

    var bundledName = Path.GetFileName(targetPath);
    var bundled = Path.Combine(env.ContentRootPath, bundledName);
    if (File.Exists(bundled))
    {
        File.Copy(bundled, targetPath);
    }
}
