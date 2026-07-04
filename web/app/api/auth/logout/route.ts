import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(){               
    const cookieStore = await cookies();
    cookieStore.delete("token");                    //Logout has to delete the HttpOnly cookie and since JS can't touch the cookie, deletion happens server-side
    return NextResponse.json({success: true});
}