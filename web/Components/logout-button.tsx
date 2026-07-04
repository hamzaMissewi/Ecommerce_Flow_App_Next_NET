"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton(){
    const router = useRouter();

    async function handleLogout(){
        await fetch("/api/auth/logout", {method: "POST"});
        router.push("/login");
        router.refresh();
    }

    return(
        <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
        >
            Sign out
        </button>
    );
}