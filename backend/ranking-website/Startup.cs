using Amazon.DynamoDBv2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ranking_website.Services.List;
using ranking_website.Services.User;
using ranking_website.Services.Auth;

namespace ranking_website
{
    public class Startup(IConfiguration configuration)
    {
        public IConfiguration Configuration { get; } = configuration;

        public void ConfigureServices(IServiceCollection services)
        {
            // Add CORS
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.WithOrigins(
                            "http://localhost:3000"
                        )
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();  // Important for OAuth
                });
            });

            // Add JWT Authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.ASCII.GetBytes(Configuration["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret not configured"))),
                        ValidateIssuer = true,
                        ValidIssuer = Configuration["Jwt:Issuer"] ?? "ranking-website",
                        ValidateAudience = false,
                        ValidateLifetime = true
                    };
                });

            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            // Add AWS DynamoDB as Singleton (better for Lambda)
            services.AddAWSService<IAmazonDynamoDB>();

            // Register services as Singleton (better for Lambda)
            services.AddSingleton<IListService, DynamoDbListService>();
            services.AddSingleton<IUserService, DynamoDbUserService>();
            services.AddSingleton<IAuthService, AuthService>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Add this at the very beginning
            app.Use(async (context, next) =>
            {
                Console.WriteLine($"=== Incoming Request ===");
                Console.WriteLine($"Path: {context.Request.Path}");
                Console.WriteLine($"Method: {context.Request.Method}");
                Console.WriteLine($"QueryString: {context.Request.QueryString}");
                await next();
                Console.WriteLine($"Response Status: {context.Response.StatusCode}");
            });

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Enable CORS - must be before UseRouting
            app.UseCors();

            app.UseHttpsRedirection();

            app.UseRouting();

            // Authentication must come AFTER UseRouting but BEFORE UseAuthorization
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}