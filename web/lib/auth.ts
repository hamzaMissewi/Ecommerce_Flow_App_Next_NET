import { cookies } from "next/headers";     //this allows the server side next.js code to read cookies sent by browser

export interface CurrentUser{       //a logged in user object should contain an id and an email
    id: string,
    email: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {       //the function is asynchronous
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if(!token) return null;

    try{
        //A JWT is header.payload.signature , the middle part holds the claims
        const payloadBase64 = token.split(".")[1];
        const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
        const payload = JSON.parse(payloadJson);

        //exp is a Unix timestamp in seconds , treat an expired token as logged out
        if(payload.exp && payload.exp * 1000 < Date.now()){
            return null;
        }

        return {
            id: payload.sub,
            email: payload.email,
        };
    }catch{
        return null;
    }
}