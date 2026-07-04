namespace Ecommerce.Api.Dtos;

public record ProductDto(
    int Id,
    string Name,
    string Slug,
    string Description,
    decimal Price,
    int StockQuantity,
    string? ImageUrl,
    string Category
);