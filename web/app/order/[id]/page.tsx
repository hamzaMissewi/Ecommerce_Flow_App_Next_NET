import { getOrder } from "@/lib/order-actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(Number(id));

  if (!order) notFound();

  const statusColor: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Order #{order.id}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${statusColor[order.status] ?? "bg-gray-100 text-gray-800"}`}
          >
            {order.status}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Placed on {new Date(order.orderDate).toLocaleDateString()} at{" "}
          {new Date(order.orderDate).toLocaleTimeString()}
        </p>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-medium text-gray-500">Shipping to</h2>
          <p className="mt-1 text-gray-900">{order.shippingAddress}</p>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Items</h2>
          <ul className="mt-4 divide-y divide-gray-200">
            {order.items.map((item) => (
              <li key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={item.imageUrl ?? `https://picsum.photos/seed/${item.productId}/200`}
                    alt={item.productName}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/products/${item.productId}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {item.productName}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">
                    ${item.unitPrice.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  ${item.lineTotal.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6">
          <span className="text-lg font-medium text-gray-700">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>

        <Link
          href="/products"
          className="mt-8 inline-block font-medium text-gray-900 hover:underline"
        >
          ← Continue shopping
        </Link>
      </div>
    </main>
  );
}
