import { getCurrentUser  } from "@/lib/auth";

export default async function AccountPage(){
    const user = await getCurrentUser();

    return(
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-2x1 px-6 py-12">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Your account
                </h1>

                <div className="mt-6 rounded-x1 border border-gray-200 bg-white p-6">
                    <p className="text-sm text-gray-500">
                        Signed in as
                    </p>
                    <p className="text-sm text-gray-500">
                        {user?.email}
                    </p>
                </div>
            </div>
        </main>
    );
}