import { NextResponse, NextRequest } from "next/server";
import { getDatabase, ref, onValue } from "firebase/database";
import emailjs from "emailjs-com";


// API Handler
export async function POST(req: NextRequest) {
    try {
   const emails = await req.json();
    if(!(emails)){
        return NextResponse.json({ error: "Invalid email format"}, {status: 400});
    }
    console.log("Received Emails",emails);
    return NextResponse.json({ success:true, message: "Emails received successfully!"});
} catch(error) {
    return NextResponse.json({ error: "Something went wrong /api/emailTrigger"}, {status: 500});
}
}