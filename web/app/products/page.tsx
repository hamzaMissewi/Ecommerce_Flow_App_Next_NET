import { getProducts, getCategories } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import CatalogFilters from "@/components/CatalogFilters";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{category?: string; search?: string}>;
}) {
    const {category, search} = await searchParams;
    const [result, categories] = await Promise.all([
        getProducts({category, search}),
        getCategories(),
    ]);


  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Products
        </h1>
        <p className="mt-2 text-sm text-gray-500">{result.totalCount} items</p>

        <CatalogFilters categories={categories}/>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`}>
            <article
              key={product.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >

              <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <Image
                        src={product.imageUrl ?? `https://picsum.photos/seed/${product.slug}/600`}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                    />
              </div>

              <div className="flex items-center justify-between">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {product.category}
                </span>
                <span className="text-xs text-gray-400">
                  {product.stockQuantity} in stock
                </span>
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                {product.name}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {product.description}
              </p>

              <p className="mt-4 text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </article>
        </Link>
          ))}
        </div>
      </div>
    </main>
  );
}