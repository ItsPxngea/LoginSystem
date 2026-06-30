using Resend;



namespace backend.Services
{
    public class EmailService : IEmailService
    {
        IResend resend = ResendClient.Create("");
        private readonly ILogger<EmailService> _logger;

        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
        }
        public async Task SendPasswordResetEmail(string toEmail, string resetLink)
        {
            //List<string> list = new List<string>([toEmail]);
            var resp = await resend.EmailSendAsync(new EmailMessage()
            {
                From = "Acme <loginSystem@resend.dev>",
                To = toEmail,
                Subject = "Reset password",
                HtmlBody = $@"
                <html>
                <body>
                <p>Reset your password</p>
                <p>Please click the link to reset your password</p>
                <a href='{resetLink}' target=""_blank"">Reset password link</a>
                </body>
                </html>"
            });
            _logger.LogInformation("To: {Email}", toEmail);
            _logger.LogInformation("Reset Link: {Link}", resetLink);
            return;
            //return Task.CompletedTask;
        }
    }
}