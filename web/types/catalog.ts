export interface Product{
    id: number;
    name: string;
    slug: string;
    description:string;
    price:number;
    stockQuantity:number;
    imageUrl:string | null;
    category: string;
}

export interface category{
    id: number;
    name:string;
    slug:string;
}

export interface PagedResult<T>{
    items: T[];
    page:number;
    pageSize:number;
    totalCount:number;
    totalPages: number;
}