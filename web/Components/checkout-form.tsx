"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkout } from "@/lib/order-actions";

export default function CheckoutForm({ total }: { total: number }) {
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    const result = await checkout(shippingAddress);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.order) {
      router.push(`/order/${result.order.id}`);
      router.refresh();
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="rounded-xl border border-gray-200 bg-white p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        Shipping address
      </h2>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Address
        <textarea
          required
          rows={3}
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Street, city, postal code, country"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-400"
      >
        {loading ? "Placing order..." : `Place order — $${total.toFixed(2)}`}
      </button>
    </form>
  );
}
