using System;
using DotNetEnv;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace sample
{
    public class Program
    {
        private const string StripeWebrootKey = "STATIC_DIR";

        private const string DefaultStaticDir = "../../client";

        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            // Load the .env file if one exists.
            DotNetEnv.Env.Load();
            return Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    var webRoot = Environment.GetEnvironmentVariable(StripeWebrootKey);

                    // If user forgets to set webroot, or improperly set - default to the current sample client folder.
                    webRoot = webRoot ??= DefaultStaticDir;
                    webBuilder.UseStartup<Startup>();

                    // Setting web root here since client folder is reused across different server samples.
                    webBuilder.UseWebRoot(webRoot);
                });
        }

    }
}