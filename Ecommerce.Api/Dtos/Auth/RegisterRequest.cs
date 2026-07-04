using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Api.Dtos.Auth;

public record RegisterRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(8)] string Password
);