import { getCurrentUser } from "@/lib/auth";
import { getOrders } from "@/lib/order-actions";
import Link from "next/link";

export default async function AccountPage(){
    const user = await getCurrentUser();
    const orders = await getOrders();

    const statusColor: Record<string, string> = {
        Pending: "text-yellow-700",
        Shipped: "text-blue-700",
        Delivered: "text-green-700",
        Cancelled: "text-red-700",
    };

    return(
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-2xl px-6 py-12">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Your account
                </h1>

                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
                    <p className="text-sm text-gray-500">
                        Signed in as
                    </p>
                    <p className="text-sm text-gray-900">
                        {user?.email}
                    </p>
                </div>

                <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900">
                    Order history
                </h2>

                {orders.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-10 text-center">
                        <p className="text-gray-500">No orders yet.</p>
                        <Link
                            href="/products"
                            className="mt-4 inline-block font-medium text-gray-900 hover:underline"
                        >
                            Start shopping →
                        </Link>
                    </div>
                ) : (
                    <div className="mt-4 space-y-4">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/order/${order.id}`}
                                className="block rounded-xl border border-gray-200 bg-white p-6 transition hover:border-gray-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Order #{order.id}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                            {" · "}
                                            {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            ${order.totalAmount.toFixed(2)}
                                        </p>
                                        <p className={`text-sm font-medium ${statusColor[order.status] ?? "text-gray-500"}`}>
                                            {order.status}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
