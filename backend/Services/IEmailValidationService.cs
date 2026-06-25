namespace backend.Services
{
    public interface IEmailValidationService
    {
        Task<(bool isValid, string? Reason)> ValidateAsync(string email);
    }
}