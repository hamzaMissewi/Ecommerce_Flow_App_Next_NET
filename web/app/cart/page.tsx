import Image from "next/image";
import Link from "next/link";
import { getCart } from "@/lib/cart-actions";
import RemoveFromCartButton from "@/components/remove-from-cart-button";

export default async function CartPage() {
  const cart = await getCart();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Your cart
        </h1>

        {cart.items.length === 0 ? (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-gray-500">Your cart is empty.</p>
            <Link
              href="/products"
              className="mt-4 inline-block font-medium text-gray-900 hover:underline"
            >
              Browse products →
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-8 space-y-4">
              {cart.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.imageUrl ?? `https://picsum.photos/seed/${item.slug}/200`}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${item.lineTotal.toFixed(2)}
                    </p>
                    <RemoveFromCartButton productId={item.productId} />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6">
              <span className="text-lg font-medium text-gray-700">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                ${cart.total.toFixed(2)}
              </span>
            </div>

            <button className="mt-6 w-full rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800">
              Checkout
            </button>
          </>
        )}
      </div>
    </main>
  );
}