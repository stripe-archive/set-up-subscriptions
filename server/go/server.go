package main

import (
  "encoding/json"
  "fmt"
  "io/ioutil"
  "net/http"
  "os"

  "github.com/foolin/goview/supports/echoview"
  "github.com/joho/godotenv"
  "github.com/labstack/echo"
  "github.com/labstack/echo/middleware"
  "github.com/stripe/stripe-go"
  "github.com/stripe/stripe-go/customer"
  "github.com/stripe/stripe-go/sub"
  "github.com/stripe/stripe-go/webhook"
)

// CreateCustomerData represents data passed in request to create customer
// object.
type CreateCustomerData struct {
  PaymentMethodID string `json:"payment_method"`
  Email           string `json:"email"`
}

// GetSubscriptionData represents data passed in request to retrieve
// subscription.
type GetSubscriptionData struct {
  SubscriptionID string `json:"subscriptionId"`
}

// PublicKey returned to client.
type PublicKey struct {
  PublicKey string `json:"publicKey"`
}

func main() {
  err := godotenv.Load("../../.env")

  if err != nil {
    fmt.Println("Error loading .env file")
  }

  fmt.Println(os.Getenv("STRIPE_SECRET_KEY"))

  stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
  e := echo.New()
  e.Use(middleware.Logger())
  e.Use(middleware.Recover())
  e.Renderer = echoview.Default()

  e.Static("/", os.Getenv("STATIC_DIR"))
  e.File("/", os.Getenv("STATIC_DIR") + "/index.html")

  e.GET("/public-key", func(c echo.Context) error {
    resp := &PublicKey{
      PublicKey: os.Getenv("STRIPE_PUBLISHABLE_KEY"),
    }
    return c.JSON(http.StatusOK, resp)
  })

  e.POST("/create-customer", func(c echo.Context) (err error) {
    request := new(CreateCustomerData)
    if err = c.Bind(request); err != nil {
      fmt.Println("Failed to parse data for create-customer")
    }

    // This creates a new Customer and attaches the PaymentMethod in one API
    // call.
    customerParams := &stripe.CustomerParams{
      PaymentMethod: stripe.String(request.PaymentMethodID),
      Email: stripe.String(request.Email),
      InvoiceSettings: &stripe.CustomerInvoiceSettingsParams{
        DefaultPaymentMethod: stripe.String(request.PaymentMethodID),
      },
    }
    customer, _ := customer.New(customerParams)

    items := []*stripe.SubscriptionItemsParams{
      {
        Plan: stripe.String(os.Getenv("SUBSCRIPTION_PLAN_ID")),
      },
    }
    params := &stripe.SubscriptionParams{
      Customer: stripe.String(customer.ID),
      Items: items,
    }
    params.AddExpand("latest_invoice.payment_intent")
    subscription, _ := sub.New(params)

    return c.JSON(http.StatusOK, subscription)
  })

  e.POST("/subscription", func(c echo.Context) (err error) {
    request := new(GetSubscriptionData)
    if err = c.Bind(request); err != nil {
      fmt.Println("Failed to parse data for /subscription")
    }

    subscription, _ := sub.Get(
      request.SubscriptionID,
      nil,
    )
    return c.JSON(http.StatusOK, subscription)
  })


  e.POST("/webhook", func(c echo.Context) (err error) {
    request := c.Request()
    payload, err := ioutil.ReadAll(request.Body)
    if err != nil {
      return err
    }

    var event stripe.Event

    webhookSecret := os.Getenv("STRIPE_WEBHOOK_SECRET")
    if webhookSecret != "" {
      event, err = webhook.ConstructEvent(payload, request.Header.Get("Stripe-Signature"), webhookSecret)
      if err != nil {
        return err
      }
    } else {
      err := json.Unmarshal(payload, &event)
      if err != nil {
        return err
      }
    }

    objectType := event.Data.Object["object"].(string)

    switch objectType {
    case "customer.created":
      // Handle logic when a customer is created
    case "customer.updated":
    case "invoice.upcoming":
    case "invoice.created":
    case "invoice.finalized":
    case "invoice.payment_succeeded":
    case "invoice.payment_failed":
    case "customer.subscription.created":
    }

    if err != nil {
      return err
    }

    return c.JSON(http.StatusOK, event)
  })

  e.Logger.Fatal(e.Start(":4242"))
}
