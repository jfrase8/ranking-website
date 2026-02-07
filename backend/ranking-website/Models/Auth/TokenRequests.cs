namespace ranking_website.Models.Auth
{
    public class RefreshRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
    public class PingRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
    public class LogoutRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
}
