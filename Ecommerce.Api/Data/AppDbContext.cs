using Ecommerce.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Data;

public class AppDbContext: IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
    {
        
    }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();

    public DbSet<CartItem> CartItems => Set<CartItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        base.OnModelCreating(modelBuilder);

       modelBuilder.Entity<Category>()
            .HasIndex(c => c.Slug)
            .IsUnique();

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Slug)
            .IsUnique();

        //Let postgres stamp CreatedAt insert time
        modelBuilder.Entity<Product>()
            .Property(p=>p.CreatedAt)
            .HasDefaultValueSql("now()");

        modelBuilder.Entity<CartItem>()
            .HasIndex(ci => new {ci.UserId, ci.ProductId})        // <- ci.Product
            .IsUnique();
    }
}