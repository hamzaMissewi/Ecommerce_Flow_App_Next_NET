namespace Ecommerce.Api.Dtos.Orders;

public record OrderItemDto(
    int ProductId,
    string ProductName,
    string? ImageUrl,
    decimal UnitPrice,
    int Quantity,
    decimal LineTotal
);

public record OrderDto(
    int Id,
    DateTime OrderDate,
    string Status,
    decimal TotalAmount,
    string ShippingAddress,
    IReadOnlyList<OrderItemDto> Items
);

public record CreateOrderRequest(string ShippingAddress);

public record OrderSummaryDto(
    int Id,
    DateTime OrderDate,
    string Status,
    decimal TotalAmount,
    int ItemCount
);
