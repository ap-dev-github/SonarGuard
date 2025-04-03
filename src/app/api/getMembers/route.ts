import { NextResponse, NextRequest } from "next/server";
import {MongoClient} from "mongodb";
import {importJWK, jwtVerify} from "jose";


//MongoDB Connection String 
const MONGO_URI = process.env.MONGO_URI??"";
const DB_NAME = process.env.DB_NAME??"";
const COGNITO_ISSUER = process.env.COGNITO_ISSUER??"";

//Function to connect to the mongoDB
const connectDB = async() => {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    return client.db(DB_NAME);
}

//verifyJWT
async function verifyToken(token: string ){
    try {
    const response = await fetch(`${COGNITO_ISSUER}/.well-known/jwks.json`);
    const {keys} =await response.json();
    //convert to JSON Web key set
    const jwks = keys.map((key: any) => ({
        kty: key.kty,
        kid: key.kid,
        alg: key.alg,
        n: key.n,
        e:key.e,
    }));
    //Verify token using the public key
    const {payload} = await jwtVerify(token, await importJWK(jwks[0], "RS256"),{
        issuer:COGNITO_ISSUER,
        audience:process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID, //Client ID Cognito
    });
    return payload;
    } catch (error) {
     console.error("Token verification failed:",error);
     return null;
    }
}

//Handle POST Request to the database
export async function GET(req: NextRequest){
    try{
      const authHeader = req.headers.get("authorization");
      if(!authHeader) {
        return NextResponse.json({error: "Unauthorized"},{status:401});
      }
      const token =authHeader.split(" ")[1];
      const decoded = await verifyToken(token);
      if(!decoded) {
        return NextResponse.json({error: "Invalid Token:"},{ status: 403});
      }
      const ownerEmail = decoded.email;
      if(!ownerEmail){
        return NextResponse.json({ error: "Owner Email is Missing!"}, {status: 400});
      }

     const db = await connectDB();
     const collection = db.collection("members");
    
     //db logic fetch the data 
     const memberDoc = await collection.findOne({ownerEmail});
     if (!memberDoc) {
      return NextResponse.json({ members: []}, {status: 200});
     }
     //return the set in memberDoc
     return NextResponse.json({ members: memberDoc.memberEmails}, {status: 200});
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({error:"Failed to Fetch Members"},{status: 500});
    }
}