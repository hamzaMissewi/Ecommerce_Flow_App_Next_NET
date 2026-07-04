import {NextResponse, type NextRequest} from "next/server";

export function proxy(request: NextRequest){    //runs on the server before any matched route renders
    const token = request.cookies.get("token")?.value;  //read the token cookie staright off the request

    if(!token){     //if no response redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next(); //contnue the request
}
//config.matcher scopes where the proxy runs
export const config = {
    matcher: ["/account/:path*",  "/cart/:path*" ]    // means it guards /account anything under it and leaves everything untouched
};