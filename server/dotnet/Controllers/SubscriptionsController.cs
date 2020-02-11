using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Stripe;

public class SubscriptionsController : Controller
{

    private readonly StripeClient client;
    private readonly IOptions<StripeOptions> options;
    private readonly ILogger<SubscriptionsController> logger;

    public SubscriptionsController(IOptions<StripeOptions> options, ILogger<SubscriptionsController> logger)
    {
        this.options = options;
        this.client = new StripeClient(options.Value.StripeSecretKey);
        this.logger = logger;
    }

    [HttpGet("public-key")]
    public ActionResult<PublicKeyResponse> GetPublishableKey()
    {
        return new PublicKeyResponse
        {
            PublicKey = this.options.Value.StripePublishableKey,
        };
    }

    [HttpPost("create-customer")]
    public async Task<ActionResult<Subscription>> CreateCustomerAsync([FromBody] CustomerCreateRequest request)
    {
        var customerService = new CustomerService(this.client);

        var customer = await customerService.CreateAsync(new CustomerCreateOptions
        {
            Email = request.Email,
            PaymentMethod = request.PaymentMethod,
            InvoiceSettings = new CustomerInvoiceSettingsOptions
            {
                DefaultPaymentMethod = request.PaymentMethod,
            }
        });

        var subscriptionService = new SubscriptionService(this.client);

        var subscription = await subscriptionService.CreateAsync(new SubscriptionCreateOptions
        {
            Items = new List<SubscriptionItemOptions>
            {
                new SubscriptionItemOptions
                {
                    Plan = this.options.Value.SubscriptionPlanId,
                },
            },
            Customer = customer.Id,
            Expand = new List<string>
            {
                "latest_invoice.payment_intent",
            }
        });

        return subscription;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> ProcessWebhookEvent()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

        try
        {
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], this.options.Value.StripeWebhookSecret);
            logger.LogInformation($"Webhook event type: {stripeEvent.Type}");
            logger.LogInformation(json);
            return Ok();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Exception while processing webhook event.");
            return BadRequest();
        }
    }
}