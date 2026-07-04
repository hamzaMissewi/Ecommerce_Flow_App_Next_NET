import { NextResponse } from "next/server";

export async function POST(request: Request){

    const body = await request.json();

    try{
        const res = await fetch(`${process.env.API_URL}/api/auth/register`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(body),
        });

        if(!res.ok){
            const errors = await res.json().catch(()=> null);
            return NextResponse.json(
                {errors: Array.isArray(errors) ? errors : ["Registration failed"]},
                {status: 400}
            );
        }

        return NextResponse.json({success:true});
    }catch{
        return NextResponse.json(
            {errors: ["Could not reach the server. Is the API running? "]},
            {status: 503}
        );
    }
}




