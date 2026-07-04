"use client";

import {useTransition} from "react";
import {useRouter} from "next/navigation";
import {removeFromCart} from "@/lib/cart-actions";


export default function RemoveFromCartButton({productId}: {productId:number}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleRemove(){
        startTransition(async() => {
            await removeFromCart(productId);
            router.refresh();
        });
    }

    return(
        <button
        onClick={handleRemove}
        disabled={isPending}
        className="text-sm text-gray-400 hover:text-red-600 disabled:opacity-50">
            {isPending ? "Removing..": "Remove"}
        </button>
    )
}