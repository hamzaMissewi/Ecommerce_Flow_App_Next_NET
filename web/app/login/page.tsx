"use client";

import { useState } from "react";
import {useRouter} from "next/navigation";

export default function LoginPage(){
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    async function handleSubmit(){
        setError(null);     //clears old errors 
        setLoading(true);   //shows th loading state


        const res = await fetch("/api/auth/login", {        //sends the email and password to the server
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
        });

        setLoading(false);

        if(!res.ok){
            setError("Invalid email or password");
            return;
        }

        router.push("/products");
        router.refresh();
    }

    return(
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
            <form onSubmit={(e) => {
                e.preventDefault(); //send the form data and reloads the page 
                handleSubmit();
            }}
            className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <h1 className="text-2x1 font-bold text-gray-900 ">Sign in </h1>

                {error && (
                     <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <label className="mt-6 block text-sm font-medium text-gray-700">
                    Email
                <input 
                  type="email"
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
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none"/>
                </label>

                <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-400">

                {loading ? "Signing in .." : "Sign in"}
                </button>
            </form>
        </main>
    );

}