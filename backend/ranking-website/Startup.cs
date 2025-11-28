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
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

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