# Stripe Billing
## Set up subscriptions sample

1. Fill out the following values in the [appsettings.json](appsettings.json) file - `StripePublishableKey`, `StripeSecretKey`, and `SubscriptionPlanId`.
2. Set `STATIC_DIR` environment variable to `../../client`.
3. Run the application using `dotnet run`.
4. Navigate to `https://localhost:4242` and verify the sample is running properly.
5. To receive and process webhook events, run `stripe listen --forward-to https://localhost:4242/webhook --skip-verify`.
6. Fill in `StripeWebhookSecret` with the webhook signing secret the Stripe CLI returns.
