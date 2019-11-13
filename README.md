# Set up subscriptions with Stripe Billing

This sample shows how to create a customer and subscribe them to a plan with
[Stripe Billing](https://stripe.com/billing). You can find step by step directions in the [Set up a Subscription](https://stripe.com/docs/billing/subscriptions/creating-subscriptions) guide.

You can also see a hosted version of the [demo](https://lbq6y.sse.codesandbox.io/) in test mode or fork it on [codesandbox.io](https://codesandbox.io/s/stripe-billing-quickstart-demo-lbq6y).
<img src="billing-subscriptions-quickstart.gif" alt="Preview of recipe" align="center">

Features:

- Collect card details 💳
- Save a card to a customer
- Subscribe a customer to a plan 💰

## How to run locally

This sample includes [6 server implementations](server/README.md) in our most popular languages. Follow the steps below to run locally.

**1. Clone and configure the sample**

The Stripe CLI is the fastest way to clone and configure a sample to run locally. 

**Using the Stripe CLI**

If you haven't already installed the CLI, follow the [installation steps](https://github.com/stripe/stripe-cli#installation) in the project README. The CLI is useful for cloning samples and locally testing webhooks and Stripe integrations.

In your terminal shell, run the Stripe CLI command to clone the sample:

```
stripe samples create set-up-subscriptions
```

The CLI will walk you through picking your integration type, server and client languages, and configuring your `.env` config file with your Stripe API keys.

**Installing and cloning manually**

If you do not want to use the Stripe CLI, you can manually clone and configure the sample:

```
git clone https://github.com/stripe-samples/create-subscriptions
```

Copy the `.env.example` file into a file named `.env` in the folder of the server you want to use. For example:

```
cp .env.example server/node/.env
```

You will need a Stripe account in order to run the demo. Once you set up your account, go to the Stripe [developer dashboard](https://stripe.com/docs/development#api-keys) to find your API keys.

```
STRIPE_PUBLISHABLE_KEY=<replace-with-your-publishable-key>
STRIPE_SECRET_KEY=<replace-with-your-secret-key>
```

`STATIC_DIR` tells the server where the client files are located and does not need to be modified unless you move the server files.

**2. Create Products and Plans on Stripe** 

This sample requires a [Plan](https://stripe.com/docs/api/plans/object) ID to create the subscription. Products and Plans are objects on Stripe that you use to model a subscription. 

You can create Products and Plans [in the Dashboard](https://dashboard.stripe.com/products) or with the [API](https://stripe.com/docs/api/plans/create). Create a Plan to run this sample and add it to your `.env`.

**3. Follow the server instructions on how to run:**

Pick the server language you want and follow the instructions in the server folder README on how to run.

```
cd server/node # there's a README in this folder with instructions
npm install
npm start
```


## FAQ

Q: Why did you pick these frameworks?

A: We chose the most minimal framework to convey the key Stripe calls and concepts you need to understand. These demos are meant as an educational tool that helps you roadmap how to integrate Stripe within your own system independent of the framework.

Q: Can you show me how to build X?

A: We are always looking for new recipe ideas, please email dev-samples@stripe.com with your suggestion!

## Author(s)

[@ctrudeau-stripe](https://twitter.com/trudeaucj)
