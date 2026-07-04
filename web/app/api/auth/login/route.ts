import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request){
    const body = await request.json();

    //Server to server call to your .NET API
    const res = await fetch(`${process.env.API_URL}/api/auth/login`,{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(body),
    }) ;

    if(!res.ok){
        return NextResponse.json(
            {message: "Invalid email or password"},
            {status: 401}
        );
    }

    const data = await res.json();
    const token = data.token as string;

    //Set the token as an httpOnly cookie the browser can hold but JS cant read
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        secure : process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 2,
    });

    return NextResponse.json({success: true});
}