using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Models;

public class Product
{
    public int Id { get; set; }

    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Slug { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Precision(18, 2)]
    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public string? ImageUrl { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    // Foreign key + navigation back to the owning category
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}