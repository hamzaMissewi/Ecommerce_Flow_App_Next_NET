namespace Ecommerce.Api.Dtos.Cart;

public record CartItemDto(
    int ProductId, 
    string Name, 
    string Slug,
    decimal Price,
    string? ImageUrl,
    int Quantity,
    decimal LineTotal           // Price x Quantity , computed server side
);


public record CartDto(
    IReadOnlyList<CartItemDto> Items,
    decimal Total,
    int ItemCount
);