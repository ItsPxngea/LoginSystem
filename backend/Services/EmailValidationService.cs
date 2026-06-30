using System.Net;
using System.Net.Mail;
using System.Text.RegularExpressions;
using DnsClient;

namespace backend.Services
{
    public class EmailValidationService : IEmailValidationService
    {
        //Checking if email is in correct format
        private static readonly Regex EmailFormatRegex = new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled);

        private readonly LookupClient _dnsClient = new(new LookupClientOptions(IPAddress.Parse("8.8.8.8"), IPAddress.Parse("1.1.1.1"))
        {
            Timeout = TimeSpan.FromSeconds(5)
        });

        public async Task<(bool isValid, string? Reason)> ValidateAsync(string email)
        {
            email = email.Trim();

            //checking email if email is in correct format and field not left empty
            if (string.IsNullOrWhiteSpace(email) || !EmailFormatRegex.IsMatch(email))
            {
                return (false, "Email address is not valid");
            }
            //--------------------------------------------------------------------------------
            try
            {
                var parsed = new MailAddress(email);
                if (parsed.Address != email) return (false, "Email address is not valid");
            }
            catch (FormatException)
            {
                return (false, "Email address is not valid");
            }
            //--------------------------------------------------------------------------------

            var domain = email.Split("@")[1];

            try
            {
                var result = await _dnsClient.QueryAsync(domain, QueryType.MX);
                var hasRecords = result.Answers.MxRecords().Any();
                Console.WriteLine($"[EmailValidation] MX query for '{domain}' -> ResponseCode: {result.Header.ResponseCode}, MX records found: {hasRecords}, Answer count: {result.Answers.Count}");
                if (hasRecords) return (true, null);

                if(result.Header.ResponseCode==DnsHeaderResponseCode.NotExistentDomain) return (false,"This email does not exist");

                var aResult = await _dnsClient.QueryAsync(domain, QueryType.A);
                var hasARecord = aResult.Answers.ARecords().Any();

                if (!hasARecord || aResult.Header.ResponseCode == DnsHeaderResponseCode.NotExistentDomain){ return (false, "This email does not accept mail");}
                Console.WriteLine("Fallback applied");
                return (true, null);

            }
            catch (Exception)
            {
                Console.WriteLine($"DNS lookup exception");
                return (false, null);
            }
        }
    }
}