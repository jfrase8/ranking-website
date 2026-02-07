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
                            Encoding.UTF8.GetBytes(Configuration["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret is missing"))),
                        ValidateIssuer = true,
                        ValidIssuer = Configuration["Jwt:Issuer"] ?? "ranking-website",
                        
                        ValidateAudience = false,
                        ValidateLifetime = true,
                    };

                    // Add this to customize 401 responses
                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            Console.WriteLine("JWT AUTH FAILED:");
                            Console.WriteLine(context.Exception.GetType().Name);
                            Console.WriteLine(context.Exception.Message);
                            return Task.CompletedTask;
                        },
                        OnChallenge = context =>
                        {
                            // Skip the default logic
                            context.HandleResponse();

                            context.Response.StatusCode = 401;
                            context.Response.ContentType = "application/json";

                            var result = System.Text.Json.JsonSerializer.Serialize(new
                            {
                                message = "Authentication required. Please provide a valid token."
                            });

                            return context.Response.WriteAsync(result);
                        },
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
            services.AddSingleton<IRefreshTokenService, DynamoDbRefreshTokenService>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Startup.cs - Inside the Configure method
            app.Use(async (context, next) =>
            {
                var auth = context.Request.Headers.Authorization.ToString();
                Console.WriteLine($"RAW AUTH HEADER: '{auth}'");
                Console.WriteLine($"=== Incoming Request ===");
                Console.WriteLine($"Path: {context.Request.Path}");
                Console.WriteLine($"Method: {context.Request.Method}");

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