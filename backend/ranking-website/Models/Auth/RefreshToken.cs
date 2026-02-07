namespace ranking_website.Models.Auth
{
    public class RefreshToken
    {
        public string Token { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime LastActivityAt { get; set; }
        public DateTime? RevokedAt { get; set; }

        public bool IsActive
        {
            get
            {
                var now = DateTime.UtcNow;
                var inactivityTimeout = TimeSpan.FromMinutes(10);

                return RevokedAt == null &&
                       now < ExpiresAt &&
                       (now - LastActivityAt) < inactivityTimeout;
            }
        }
    }
}