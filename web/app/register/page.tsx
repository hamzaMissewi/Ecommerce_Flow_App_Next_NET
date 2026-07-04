"use client";

import { useState } from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";


export default function RegisterPage(){
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(){
        setErrors([]);
        setLoading(true);

        const res = await fetch(`/api/auth/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });

        setLoading(false);

        if(!res.ok){
            const data = await res.json();
            setErrors(data.errors ?? ["Resgistration failed"]);
            return;
        }

        //Account created - send them to login to sign in
        router.push("/login");
    }

    return(
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
                <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>

                {errors.length > 0 && (
                    <ul className="mt-4 space-y-1 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                        {errors.map((err) => (
                            <li key={err}>{err}</li>
                        ))}
                    </ul>
                )}

                <label className="mt-6 block text-sm font-medium text-gray-700">
                    Email
                <input type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none"
                />
                </label>

                <label className="mt-4 block text-sm font-medium text-gray-700">
                    Password
                <input 
                 type="password"
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline"
                />
                </label>

                <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-400"
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-gray-900 hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </main>
    );
}