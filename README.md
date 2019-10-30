# Stripe Billing creating subscriptions

This sample shows how to create a customer and subscribe them to a flat rate single plan with
[Stripe Billing](https://stripe.com/billing). For step by step directions of how to
implement this use the [Creating Subscriptions](https://stripe.com/docs/billing/subscriptions/creating-subscriptions) guide.

See a hosted version of the [demo](https://lbq6y.sse.codesandbox.io/) in test mode or fork on [codesandbox.io](https://codesandbox.io/s/stripe-billing-quickstart-demo-lbq6y)
<img src="billing-subscriptions-quickstart.gif" alt="Preview of recipe" align="center">

Features:

- Collect card details 💳
- Save a card to a customer
- Subscribe a customer to a plan in Stripe Billing 💰

## How to run locally

This recipe includes [5 server implementations](server/README.md) in our most popular languages.

Copy the .env.example file into a file named .env in the folder of the server you want to use. For example:

```
cp .env.example server/node/.env
```

You will need a Stripe account in order to run the sample. Once you set up your account, go to the Stripe [developer dashboard](https://stripe.com/docs/development#api-keys) to find your API keys.

```
STRIPE_PUBLISHABLE_KEY=<replace-with-your-publishable-key>
STRIPE_SECRET_KEY=<replace-with-your-secret-key>
```

## FAQ

Q: Why did you pick these frameworks?

A: We chose the most minimal framework to convey the key Stripe calls and concepts you need to understand. These demos are meant as an educational tool that helps you roadmap how to integrate Stripe within your own system independent of the framework.

Q: Can you show me how to build X?

A: We are always looking for new recipe ideas, please email dev-samples@stripe.com with your suggestion!

## Author(s)

[@ctrudeau-stripe](https://twitter.com/trudeaucj)
