# Stripe Billing charging for subscriptions

This sample shows how to create a customer and subscribe them to a flat rate single plan with
[Stripe Billing](https://stripe.com/billing). For step by step directions of how to
implement this use the [Stripe Billing quickstart](https://stripe.com/docs/billing/quickstart).

See a hosted version of the [demo](https://lbq6y.sse.codesandbox.io/) in test mode or fork on [codesandbox.io](https://codesandbox.io/s/stripe-billing-quickstart-demo-lbq6y)
<img src="billing-subscriptions-quickstart.gif" alt="Preview of recipe" align="center">

Features:

- Collect card details 💳
- Save a card to a customer
- Subscribe a customer to a plan in Stripe Billing 💰

## How to run locally

This recipe includes [5 server implementations](server/README.md) in our most popular languages.

If you want to run the recipe locally, copy the .env.example file to your own .env file in this directory:

```
cp .env.example .env
```

You will need a Stripe account with its own set of [API keys](https://stripe.com/docs/development#api-keys).

## FAQ

Q: Why did you pick these frameworks?

A: We chose the most minimal framework to convey the key Stripe calls and concepts you need to understand. These demos are meant as an educational tool that helps you roadmap how to integrate Stripe within your own system independent of the framework.

Q: Can you show me how to build X?

A: We are always looking for new recipe ideas, please email tbd@stripe.com with your suggestion!

## Author(s)

[@ctrudeau-stripe](https://twitter.com/trudeaucj)
