using Ecommerce.Api.Data;
using Ecommerce.Api.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProductsController(AppDbContext db)
    {
        _db = db;
    }

    //GET /api/products
     [HttpGet]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetProducts(
        [FromQuery] string? category = null,
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {

        page = Math.Max(page,1);
        pageSize = Math.Clamp(pageSize, 1, 50);
        
        //start with a base query , nothing has executed yet 
        var query = _db.Products.Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(p => p.Category.Slug ==category);
        
        if(!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => EF.Functions.ILike(p.Name , $"%{search}%"));

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(p => p.Name)
            .Skip((page-1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductDto(
            p.Id, p.Name, p.Slug, p.Description,
            p.Price, p.StockQuantity, p.ImageUrl, p.Category.Name))
        .ToListAsync();

    return Ok(new PagedResult<ProductDto>(items, page, pageSize, totalCount));

    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProductDto>> GetProduct(string slug)
    {
        var product = await _db.Products
            .Where(p => p.IsActive && p.Slug == slug)
            .Select(p => new ProductDto(p.Id, p.Name, p.Slug, p.Description, p.Price,
            p.StockQuantity, p.ImageUrl, p.Category.Name))
            .FirstOrDefaultAsync();

        if(product is null)
            return NotFound();

        return Ok(product);
    }
}