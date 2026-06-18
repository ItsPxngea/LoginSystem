namespace backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;

        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
        }
        public Task SendPasswordResetEmail(string toEmail, string resetLink)
        {
            _logger.LogInformation("To: {Email}",toEmail);
            _logger.LogInformation("Reset Link: {Link}", resetLink);

            return Task.CompletedTask;
        }
    }
}