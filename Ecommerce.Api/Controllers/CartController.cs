using System.Security.Claims;
using Ecommerce.Api.Data;
using Ecommerce.Api.Dtos.Cart;
using Ecommerce.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly AppDbContext _db;
    public CartController(AppDbContext db)
    {
        _db = db;
    }

    //Pulls the user's id out of the validated JWT
    private string UserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new InvalidOperationException("No user id in token");

    //GET /api/cart
    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCart()
    {
        var items = await _db.CartItems
            .Where(ci => ci.UserId == UserId)
            .OrderBy(ci => ci.Product.Name)
            .Select(ci => new CartItemDto(
                ci.ProductId,
                ci.Product.Name,
                ci.Product.Slug,
                ci.Product.Price,
                ci.Product.ImageUrl,
                ci.Quantity,
                ci.Product.Price * ci.Quantity
            ))
            .ToListAsync();

        var cart = new CartDto(
            items,
            items.Sum(i => i.LineTotal),
            items.Sum(i => i.Quantity));

        return Ok(cart);
    }

    // POST /api/cart
    [HttpPost]
    public async Task<IActionResult> AddToCart(AddToCartRequest request)
    {
        if(request.Quantity < 1)
            return BadRequest(new {message="Quantity must be at least 1"});

        var product = await _db.Products.FindAsync(request.ProductId);
        if(product is null || !product.IsActive)
            return NotFound(new {message="Product not found "});

        var existing = await _db.CartItems
            .FirstOrDefaultAsync(ci =>
                ci.UserId == UserId && ci.ProductId == request.ProductId);

        var totalRequested = request.Quantity + (existing?.Quantity ?? 0);
        if (product.StockQuantity < totalRequested)
            return BadRequest(new { message = $"Only {product.StockQuantity} in stock" });

        if (existing is null)
        {
            _db.CartItems.Add(new CartItem
            {
                UserId = UserId,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
            });
        }
        else
        {
            existing.Quantity += request.Quantity;

        }

        await _db.SaveChangesAsync();
        return Ok(new {message = "Added to cart"});
    }

    // DELETE /api/cart/{productId}
    [HttpDelete("{productId:int}")]
    public async Task<IActionResult> RemoveFromCart(int productId)
    {
        var item = await _db.CartItems
            .FirstOrDefaultAsync(ci => 
            ci.UserId == UserId && ci.ProductId == productId);

        if(item is null)
            return NotFound();

        _db.CartItems.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}