using Ecommerce.Api.Dtos.Auth;
using Ecommerce.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly Ecommerce.Api.Services.TokenService _tokenService;


    public AuthController(UserManager<ApplicationUser> userManager, Ecommerce.Api.Services.TokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(e => e.Description));
        }

        return Ok(new {message = "Registration successful"});
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if(user is null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return Unauthorized(new{message = "Invalid email or password"});
        }

        var token = _tokenService.CreateToken(user);
        return Ok(new {token});
    }
}