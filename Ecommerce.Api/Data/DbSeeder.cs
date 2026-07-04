using Ecommerce.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        // Idempotent: if there are already categories, do nothing.
        if (await db.Categories.AnyAsync())
            return;

        var electronics = new Category { Name = "Electronics", Slug = "electronics" };
        var books = new Category { Name = "Books", Slug = "books" };
        var clothing = new Category { Name = "Clothing", Slug = "clothing" };

        electronics.Products =
        [
            new() { Name = "Wireless Headphones", Slug = "wireless-headphones", Description = "Over-ear Bluetooth headphones with noise cancellation.", Price = 129.99m, StockQuantity = 40, ImageUrl = "https://picsum.photos/seed/headphones/600" },
            new() { Name = "Mechanical Keyboard", Slug = "mechanical-keyboard", Description = "Compact 75% hot-swappable keyboard.", Price = 89.50m, StockQuantity = 25 },
            new() { Name = "USB-C Charger", Slug = "usb-c-charger", Description = "65W GaN fast charger with two ports.", Price = 34.00m, StockQuantity = 100 },
        ];

        books.Products =
        [
            new() { Name = "The Pragmatic Programmer", Slug = "pragmatic-programmer", Description = "Classic guide to software craftsmanship.", Price = 42.00m, StockQuantity = 15 },
            new() { Name = "Clean Code", Slug = "clean-code", Description = "A handbook of agile software craftsmanship.", Price = 38.75m, StockQuantity = 18 },
        ];

        clothing.Products =
        [
            new() { Name = "Cotton T-Shirt", Slug = "cotton-t-shirt", Description = "Soft, breathable everyday tee.", Price = 19.99m, StockQuantity = 200 },
            new() { Name = "Hooded Sweatshirt", Slug = "hooded-sweatshirt", Description = "Fleece-lined pullover hoodie.", Price = 54.00m, StockQuantity = 60 },
        ];

        db.Categories.AddRange(electronics, books, clothing);
        await db.SaveChangesAsync();
    }
}