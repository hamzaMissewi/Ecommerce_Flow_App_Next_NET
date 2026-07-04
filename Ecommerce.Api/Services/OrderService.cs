using Ecommerce.Api.Data;
using Ecommerce.Api.Dtos.Orders;
using Ecommerce.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Services;

public class OrderService
{
    private readonly AppDbContext _db;

    public OrderService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<OrderDto> CreateOrderAsync(string userId, string shippingAddress)
    {
        var cartItems = await _db.CartItems
            .Include(ci => ci.Product)
            .Where(ci => ci.UserId == userId)
            .OrderBy(ci => ci.Product.Name)
            .ToListAsync();

        if (cartItems.Count == 0)
            throw new InvalidOperationException("Cart is empty");

        foreach (var item in cartItems)
        {
            if (item.Product.StockQuantity < item.Quantity)
                throw new InvalidOperationException(
                    $"Not enough stock for {item.Product.Name}. Available: {item.Product.StockQuantity}");
        }

        var orderItems = cartItems.Select(ci => new OrderItem
        {
            ProductId = ci.ProductId,
            ProductName = ci.Product.Name,
            ImageUrl = ci.Product.ImageUrl,
            UnitPrice = ci.Product.Price,
            Quantity = ci.Quantity,
        }).ToList();

        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            Status = OrderStatus.Pending,
            ShippingAddress = shippingAddress,
            TotalAmount = orderItems.Sum(oi => oi.UnitPrice * oi.Quantity),
            OrderItems = orderItems,
        };

        _db.Orders.Add(order);

        foreach (var ci in cartItems)
        {
            ci.Product.StockQuantity -= ci.Quantity;
        }

        _db.CartItems.RemoveRange(cartItems);

        await _db.SaveChangesAsync();

        return MapToDto(order);
    }

    public async Task<IReadOnlyList<OrderSummaryDto>> GetUserOrdersAsync(string userId)
    {
        return await _db.Orders
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new OrderSummaryDto(
                o.Id,
                o.OrderDate,
                o.Status.ToString(),
                o.TotalAmount,
                o.OrderItems.Sum(oi => oi.Quantity)
            ))
            .ToListAsync();
    }

    public async Task<OrderDto?> GetOrderByIdAsync(int orderId, string userId)
    {
        var order = await _db.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        return order is null ? null : MapToDto(order);
    }

    private static OrderDto MapToDto(Order order)
    {
        return new OrderDto(
            order.Id,
            order.OrderDate,
            order.Status.ToString(),
            order.TotalAmount,
            order.ShippingAddress,
            order.OrderItems.Select(oi => new OrderItemDto(
                oi.ProductId,
                oi.ProductName,
                oi.ImageUrl,
                oi.UnitPrice,
                oi.Quantity,
                oi.LineTotal
            )).ToList()
        );
    }
}
