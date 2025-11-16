using Amazon.Lambda.AspNetCoreServer;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.AspNetCore.Builder;
using ranking_website;

var builder = WebApplication.CreateBuilder(args);

// Use Startup style
var startup = new Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

var app = builder.Build();

startup.Configure(app, app.Environment);

app.Run();
