namespace  Ecommerce.Api.Models;

public class CartItem
{
    public int Id {get;set;}

    //whose cart this belongs to - FK to AspNetUsers (string GUID id)
    public string UserId {get;set;} = string.Empty;

    public ApplicationUser User {get;set;} = null!;

    // Which product, and how many
    public int ProductId {get;set;}
    public Product Product {get;set;} = null!;

    public int Quantity {get;set;}
}