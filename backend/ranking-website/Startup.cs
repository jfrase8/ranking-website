using Amazon.DynamoDBv2;
using ranking_website.Services;

namespace ranking_website
{
    using Microsoft.AspNetCore.Authentication.Negotiate;
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
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });

            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            // Add AWS DynamoDB as Singleton (better for Lambda)
            services.AddAWSService<IAmazonDynamoDB>();

            // Register your service as Singleton (better for Lambda)
            services.AddSingleton<IListService, DynamoDbService>();
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
            app.UseAuthentication();
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}