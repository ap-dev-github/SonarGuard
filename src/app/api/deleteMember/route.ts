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
export async function DELETE(req: NextRequest){
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
      const body = await req.json();
      const { delEmail : memberEmail } = body;
      if(!memberEmail || !ownerEmail){
        return NextResponse.json({ error: "Both memberEmail and the ownerEmail are required"}, {status: 400});
      }

     const db = await connectDB();
     const collection = db.collection("members");
      //logic to delete the memberemail from the set
     await collection.updateOne(
        {ownerEmail},
        {$pull:{memberEmails: memberEmail}},// delete the member from the set
     );

     return NextResponse.json({ message: "Member deleted successfully!"}, {status: 201});
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({error:"Failed to delete member"},{status: 500});
    }
}