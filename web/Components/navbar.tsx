import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";
import {getCart} from "@/lib/cart-actions";

export default async function Navbar(){
    const user = await  getCurrentUser();

    const cart = user ? await getCart() : null;

    return (
        <header className="border-b border-gray-200 bg-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/products" className="text-lg font-bold text-gray-900">
                My Store
                </Link>

                <div className="flex items-center gap-4 text-sm">
                    {user ? (
                        <>
                        <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
                            Cart
                            {cart && cart.itemCount > 0 && (
                                <span className="ml-1 rounded-full bg-gray-900 px-2 py-0.5 text-xs text-white">
                                    {cart.itemCount}
                                </span>
                            )}
                        </Link>

                        <Link href="/account" className="text-gray-600 hover:text-gray-900">
                            {user.email}
                        </Link>
                        <LogoutButton/>
                        </>
                    ) : (
                        <>
                        <Link href="/login" className="text-gray-600 hover:text-gray-900">
                           Sign in
                        </Link>
                        <Link
                          href="/register"
                          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
                        >
                          Create Account
                        </Link>
                        </>
                    )}
                </div>
                </nav>
                </header>
    );
}