"use server";

import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import { revalidatePath } from "next/cache";
import type { CartDto } from "@/types/cart";

async function authedFetch(path: string, options: RequestInit = {}){
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("[authedFetch] token present:", !!token, "len:", token?.length);  // probe

    // No token -> Not logged in -> send them to sign in 
    if(!token){
        redirect("/login");
    }

    return fetch(`${process.env.API_URL}${path}`, {
        ...options,
        headers: {
            ...options.headers,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        cache:"no-store",
    });
}

export async function addToCart(productId: number, quantity: number = 1){
    const res = await authedFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({productId, quantity}),
    });

    console.log("[addToCart] status=", res.status);

    if(!res.ok){
        console.log("[addToCart] body =", await res.text());
        return {error: "Could not add to cart"};
    }

    revalidatePath("/cart");
    return {success:true};
}

export async function getCart() : Promise<CartDto> {
    const res = await authedFetch("/api/cart");

    if(!res.ok){
        return {items:[], total:0, itemCount:0};
    }

    return (await res.json()) as CartDto;
}

export async function removeFromCart(productId: number) {
    const res = await authedFetch(`/api/cart/${productId}`, {
        method: "DELETE",
    });

    if(!res.ok){
        return {error: "Could not remove item"}
    }

    revalidatePath("/cart");
    return {success: true};
    
}