# Stripe Billing
### Set up subscriptions sample

## Install .NET Core

If you do not already have dotnet installed, download it from here: https://dotnet.microsoft.com/download.

## Configure the sample

1. Navigate to the Stripe Dashboard to retrieve the API Keys necessary to run the sample.
2. Create a [plan](https://stripe.com/docs/billing/subscriptions/products-and-plans) using the Dashboard or the Stripe CLI.
3. Fill out the following values in the [appsettings.Development.json](appsettings.Development.json) file.
    1. `StripePublishableKey`
    2. `StripeSecretKey`
    3. `SubscriptionPlanId`
4. Set the `STATIC_DIR` environment variable to `../../client`.
    - Note: This is only because the various sample server implementations use the same client code.

## Run the application

1. If testing webhooks locally, make sure to have the [Stripe CLI](https://stripe.com/docs/stripe-cli) installed.
    - Run `stripe listen --forward-to https://localhost:4242/webhook --skip-verify`.
    - Fill in `StripeWebhookSecret` with the webhook signing secret the Stripe CLI returns.
2. Run the sample application using `dotnet run`.
3. Navigate to `https://localhost:4242` and verify the sample is running properly.
