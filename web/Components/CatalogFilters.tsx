"use client";

import {useRouter, useSearchParams} from "next/navigation";
import type { category } from "@/types/catalog";

export default function CatalogFilters({
    categories, 
}: {
    categories: category[];
}){
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeCategory = searchParams.get("category") ?? "";

    function updateParam(key: string, value:string){
        const params = new URLSearchParams(searchParams.toString());
        if(value){
            params.set(key,value);
        }else{
            params.delete(key);
        }
        router.push(`/products?${params.toString()}`);
    }

    return(
        <div className="mt-6 flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search Products..."
              defaultValue={searchParams.get("search") ?? ""}
              onChange={(e) => updateParam("search", e.target.value)}
              className="w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none"
              />

        <div className="flex flex-wrap gap-2">
        <button
           onClick={() => updateParam("category", "")}
           className={`rounded-full px-4 py-2 text-sm font-medium transaction ${
            activeCategory === ""
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
           }`}
           >
            All
           </button>{categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateParam("category", cat.slug)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === cat.slug
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}