using Newtonsoft.Json;

public class SubscriptionRetrieveRequest
{
    [JsonProperty("subscriptionId")]
    public string SubscriptionId { get; set; }
}