import type {category, PagedResult, Product} from "@/types/catalog";

const API_URL = process.env.API_URL;

interface GetProductParams{
    category?: string ;
    search?: string;
    page?: number;
    pageSize?: number;
}

export async function getProducts(
    params: GetProductParams = {}
): Promise<PagedResult<Product>>{
    if(!API_URL){
        throw new Error("Api_url is not set - check web/.env.local");
    }

    const query = new URLSearchParams();
    if(params.category) query.set("category", params.category);
    if(params.search) query.set("search", params.search);
    if(params.page) query.set("page", String(params.page));
    if(params.pageSize) query.set("pageSize", String(params.pageSize));

    const res = await fetch(`${API_URL}/api/products?${query}`,{
        cache: "no-store",
    });

    if(!res.ok){
        throw new Error(`Failed to fetch products: ${res.status}`);
    }

    return (await res.json()) as PagedResult<Product>;

}

export async function getCategories(): Promise<category[]>{
    if(!API_URL) throw new Error("API_URL is not set - check web/.env.local");

    const res = await fetch(`${API_URL}/api/categories`, {cache: "no-store"});
    if(!res.ok) throw new Error(`Failed to fetch categories : ${res.status}`);

    return (await res.json()) as category[];
}

export async function getProduct(slug: string) : Promise<Product | null>{
    if(!API_URL) throw new Error("API_URL is not set - check web/.env.local");
    const res = await fetch(`${API_URL}/api/products/${slug}`,{
        cache: "no-store",
    });

    if(res.status === 404) return null;
    if(!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);

    return (await res.json()) as Product;
}