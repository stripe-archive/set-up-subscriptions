package com.stripe.sample;

import static spark.Spark.get;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.annotations.SerializedName;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.Invoice;
import com.stripe.model.StripeObject;
import com.stripe.model.Subscription;
import com.stripe.net.Webhook;

import io.github.cdimascio.dotenv.Dotenv;

public class Server {
    private static Gson gson = new Gson();

    static class CreatePaymentBody {
        @SerializedName("payment_method")
        String paymentMethod;
        @SerializedName("email")
        String email;

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public String getEmail() {
            return email;
        }
    }

    static class CreateSubscriptionBody {
        @SerializedName("subscriptionId")
        String subscriptionId;

        public String getSubscriptionId() {
            return subscriptionId;
        }
    }

    public static void main(String[] args) {
        port(4242);
        String ENV_PATH = "../../";
        Dotenv dotenv = Dotenv.configure().directory(ENV_PATH).load();

        Stripe.apiKey = System.getenv("STRIPE_SECRET_KEY");

        staticFiles.externalLocation(
                Paths.get(Paths.get("").toAbsolutePath().toString(), dotenv.get("STATIC_DIR")).normalize().toString());

        get("/public-key", (request, response) -> {
            response.type("application/json");
            JsonObject publicKey = new JsonObject();
            publicKey.addProperty("publicKey", dotenv.get("STRIPE_PUBLIC_KEY"));
            return publicKey.toString();
        });

        post("/create-customer", (request, response) -> {
            response.type("application/json");

            CreatePaymentBody postBody = gson.fromJson(request.body(), CreatePaymentBody.class);
            // This creates a new Customer and attaches the PaymentMethod in one API call.
            Map<String, Object> customerParams = new HashMap<String, Object>();
            customerParams.put("payment_method", postBody.getPaymentMethod());
            customerParams.put("email", postBody.getEmail());
            Map<String, String> invoiceSettings = new HashMap<String, String>();
            invoiceSettings.put("default_payment_method", postBody.getPaymentMethod());
            customerParams.put("invoice_settings", invoiceSettings);

            Customer customer = Customer.create(customerParams);

            // Subscribe customer to a plan
            Map<String, Object> item = new HashMap<>();
            item.put("plan", dotenv.get("SUBSCRIPTION_PLAN_ID"));
            Map<String, Object> items = new HashMap<>();
            items.put("0", item);

            Map<String, Object> expand = new HashMap<>();
            expand.put("0", "latest_invoice.payment_intent");
            Map<String, Object> params = new HashMap<>();
            params.put("customer", customer.getId());
            params.put("items", items);
            params.put("expand", expand);
            Subscription subscription = Subscription.create(params);

            return subscription.toJson();
        });

        post("/subscription", (request, response) -> {
            response.type("application/json");

            CreateSubscriptionBody postBody = gson.fromJson(request.body(), CreateSubscriptionBody.class);
            return Subscription.retrieve(postBody.getSubscriptionId()).toJson();
        });

        post("/webhook", (request, response) -> {
            String payload = request.body();
            String sigHeader = request.headers("Stripe-Signature");
            String endpointSecret = dotenv.get("STRIPE_WEBHOOK_SECRET");
            Event event = null;

            try {
                event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
            } catch (SignatureVerificationException e) {
                // Invalid signature
                response.status(400);
                return "";
            }

            // Deserialize the nested object inside the event
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            StripeObject stripeObject = null;
            if (dataObjectDeserializer.getObject().isPresent()) {
                stripeObject = dataObjectDeserializer.getObject().get();
            } else {
                // Deserialization failed, probably due to an API version mismatch.
                // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
                // instructions on how to handle this case, or return an error here.
            }

            switch (event.getType()) {
            case "customer.created":
                // Customer customer = (Customer) stripeObject;
                // System.out.println(customer.toJson());
                break;
            case "customer.updated":
                // Customer customer = (Customer) stripeObject;
                // System.out.println(customer.toJson());
                break;
            case "invoice.upcoming":
                // Invoice invoice = (Invoice) stripeObject;
                // System.out.println(invoice.toJson());
                break;
            case "invoice.created":
                // Invoice invoice = (Invoice) stripeObject;
                // System.out.println(invoice.toJson());
                break;
            case "invoice.finalized":
                // Invoice invoice = (Invoice) stripeObject;
                // System.out.println(invoice.toJson());
                break;
            case "invoice.payment_succeeded":
                // Invoice invoice = (Invoice) stripeObject;
                // System.out.println(invoice.toJson());
                break;
            case "invoice.payment_failed":
                // Invoice invoice = (Invoice) stripeObject;
                // System.out.println(invoice.toJson());
                break;
            case "customer.subscription.created":
                Subscription subscription = (Subscription) stripeObject;
                System.out.println(subscription.toJson());
                break;
            default:
                // Unexpected event type
                response.status(400);
                return "";
            }

            response.status(200);
            return "";
        });
    }
}