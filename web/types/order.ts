export interface OrderItem {
    productId: number;
    productName: string;
    imageUrl: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
}

export interface Order {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
    shippingAddress: string;
    items: OrderItem[];
}

export interface OrderSummary {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
    itemCount: number;
}
