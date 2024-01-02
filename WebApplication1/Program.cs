using WebApplication1;
using WebApplication1.Hubs;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();  
builder.Services.AddRazorPages();
builder.Services.AddSignalR();
builder.Services.AddSingleton<IDictionary<string, Connection>>(opt => new Dictionary<string,Connection>());
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey
    });
});
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseCors();
app.UseEndpoints(endpoint =>
{
    endpoint.MapHub<ChatHub>("/chat");
});
app.UseHttpsRedirection();
app.UseStaticFiles();


app.UseAuthorization();

app.MapRazorPages();

app.Run();
