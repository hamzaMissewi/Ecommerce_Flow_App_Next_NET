export interface CartItem {
    productId: number;
    name: string;
    slug: string;
    price: number;
    imageUrl: string | null;
    quantity : number;
    lineTotal: number;
}

export interface CartDto{
    items: CartItem[];
    total: number;
    itemCount: number;
}