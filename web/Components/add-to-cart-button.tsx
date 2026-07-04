"use client";

import { useState, useTransition } from "react";
import { useRouter} from "next/navigation";
import { addToCart } from "@/lib/cart-actions";

export default function AddToCartButton({
    productId,
    disabled,
}:{
    productId: number;
    disabled?: boolean;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [added, setAdded] = useState(false);


    function handleClick(){
        startTransition(async () => {
            const result = await addToCart(productId, 1);
            if(result?.success){
                setAdded(true);
                router.refresh();
                setTimeout(() => setAdded(false), 2000);
            }
        });
    }

    return(
        <button 
         onClick={handleClick} 
         disabled={disabled || isPending}
         className="mt-8 w-full rounded-x1 bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 md:w-auto"
        >
            {isPending ? "Adding..." : added ? "Added " : "Add to cart"}
        </button>
    );
}