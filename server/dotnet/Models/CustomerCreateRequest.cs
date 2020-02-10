using Newtonsoft.Json;

public class CustomerCreateRequest
{

    [JsonProperty("email")]
    public string Email { get; set; }

    [JsonProperty("payment_method")]
    public string PaymentMethod { get; set; }
}