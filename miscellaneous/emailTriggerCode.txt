import { NextResponse, NextRequest } from "next/server";
import { getDatabase, ref, onValue } from "firebase/database";
import emailjs from "emailjs-com";

const db = getDatabase();
const movementRef = ref(db, "movement");

// Function to fetch email list from backend
const fetchEmails = async (token: string) => {
    try {
        const response = await fetch("/api/getMembers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
                
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in fetchEmails:", error);
        return { error: "Failed to fetch members" };
    }
};

// API Handler
export async function GET(req: NextRequest) {
    // Extract token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1]; 
    console.log("Received Token in API:", token); 

    // Fetch members using token
    const data = await fetchEmails(token);
    console.log("Fetched Members:", data);

    return NextResponse.json({ message: "API Email Trigger Response", data }, { status: 200 });
}