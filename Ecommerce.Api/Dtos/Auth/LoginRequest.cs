using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Api.Dtos.Auth;

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);