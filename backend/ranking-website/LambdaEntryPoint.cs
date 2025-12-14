using Amazon.Lambda.AspNetCoreServer;

namespace ranking_website
{
    // Changed from APIGatewayHttpApiV2ProxyFunction to APIGatewayProxyFunction
    public class LambdaEntryPoint : APIGatewayProxyFunction
    {
        protected override void Init(IWebHostBuilder builder)
        {
            builder.UseStartup<Startup>();
        }
    }
}