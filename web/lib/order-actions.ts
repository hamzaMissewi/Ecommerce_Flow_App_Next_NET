"use server";

import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Order, OrderSummary } from "@/types/order";

async function authedFetch(path: string, options: RequestInit = {}){
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

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

export async function checkout(shippingAddress: string): Promise<{order?: Order; error?: string}> {
    const res = await authedFetch("/api/orders/checkout", {
        method: "POST",
        body: JSON.stringify({shippingAddress}),
    });

    if(!res.ok){
        const body = await res.json();
        return {error: body.message ?? "Checkout failed"};
    }

    const order = (await res.json()) as Order;
    revalidatePath("/cart");
    revalidatePath("/account");
    return {order};
}

export async function getOrders(): Promise<OrderSummary[]> {
    const res = await authedFetch("/api/orders");

    if(!res.ok) return [];

    return (await res.json()) as OrderSummary[];
}

export async function getOrder(id: number): Promise<Order | null> {
    const res = await authedFetch(`/api/orders/${id}`);

    if(!res.ok) return null;

    return (await res.json()) as Order;
}
