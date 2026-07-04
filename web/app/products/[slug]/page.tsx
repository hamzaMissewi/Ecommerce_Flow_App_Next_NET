import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import AddToCartButton from "@/components/add-to-cart-button";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: `${product.name} — My Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl ?? `https://picsum.photos/seed/${product.slug}/800`],
    },
  };
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if(!product){
        notFound();
    }

    return(
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-5x1 px-6 py-12">
                <Link
                 href="/products"
                 className="text-sm text-gray-500 hover:text-gray-900"
                 >
                    Back to products
                </Link>

                <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div className="relative aspect-square overflow-hidden rounded-2x1 bg-gray-100">
                        <Image
                          src={product.imageUrl ?? `https://picsum.photos/seed/${product.slug}/800`}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                          />
                    </div>

                    <div className="flex flex-col">
                    <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        {product.category}
                    </span>

                    <h1 className="mt-4 text-3x1 font-bold tracking-tight text-gray-900">
                        {product.name}
                    </h1>

                    <p className="mt-4 text-gray-600">{product.description}</p>

                    <p className="mt-6 text-4x1 font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        {product.stockQuantity >0 
                        ? `${product.stockQuantity} in stock`
                         : "Out of stock"}
                    </p>

                    <AddToCartButton
                        productId={product.id}
                        disabled={product.stockQuantity == 0}    
                    />
                    </div>
                </div>
            </div>
        </main>
    );
}