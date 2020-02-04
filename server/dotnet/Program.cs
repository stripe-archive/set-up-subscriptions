using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace sample
{
    public class Program
    {
        private const string StripeWebrootKey = "STATIC_DIR";

        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    var webRoot = Environment.GetEnvironmentVariable(StripeWebrootKey);
                    webBuilder.UseStartup<Startup>();

                    // Setting web root here since client folder is reused across different server samples.
                    webBuilder.UseWebRoot(webRoot);
                });
    }
}
