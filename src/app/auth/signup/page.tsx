"use client"
import React, { useState } from "react";
import { CognitoUserAttribute, CognitoUser,CognitoUserPool, ISignUpResult } from "amazon-cognito-identity-js";
import { userPool } from "../../../utils/cognitoConfig";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    // AWS Cognito required attributes
    const attributes = [
        new CognitoUserAttribute({ Name: "email", Value: email }),
        new CognitoUserAttribute({ Name: "name", Value: name }),
    ];

    //get CognitoUser
    const getCognitoUser = () => new CognitoUser({Username: email, Pool: userPool });

    //handle Signup
    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }
        
        userPool.signUp(email, password, attributes, [], (err, data?: ISignUpResult) => {
            interface CognitoError extends Error {
                code?: string;
            }

            if (err) {      
                if((err as CognitoError).code === "UsernameExistsException"){
                    try{
                        //check if the user exist && verified
                        const cognitoUser = getCognitoUser();
                    
                    cognitoUser.getSession((sessionErr: Error| null, session: any) => {
                    if(sessionErr || !session?.isValid()) {
                        // user exist and isn't verified
                        resendConfirmationCode(email);
                        setMessage("User already exists but is not verified. Verification code resent!");
                    } else{
                        //User is verified
                        setMessage("User already verified. Please log in.");
                    }
                    });
                    }
                    catch(error){
                    console.error("Error checking user verification:", error);
                    setMessage("An error occurred. Please try logging in.");
                    }
        
                } else {
                    console.error("Signup Error:", err.message);
                    setMessage(err.message);
                }
            } else {
                console.log("Signup Successful:", data);
                setMessage("Signup successful! Please verify your email.");
                setIsVerifying(true);
            }
        });
    };

    //resend otp if user already exist
    const resendConfirmationCode = (email: string) => {
        const user = getCognitoUser();
        user.resendConfirmationCode((err, result) => {
        if(err) {
            console.log("Error resending code:", err.message);
            setMessage(err.message);
        } else {
            console.log("OTP resent successfully:", result);
            setMessage("Verification code resent! Check your email. ");
            setIsVerifying(true);
        }
        });
    }

    //handle the otp verification
    const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = getCognitoUser();
    user.confirmRegistration(otp, true, (err, result) => {
        if(err) {
            console.error("Verification Error:", err.message);
            setMessage(err.message);
        } else {
            console.log("Verification Successful:",result);
            setMessage("Verification successful! You can login in.");
            setIsVerifying(false);
        }
    })  ; 
    };


    return (

        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            {isVerifying ? (
                <form 
                className="bg-white p-8 rounded-lg shadow-lg w-96"
                onSubmit={handleVerifyOtp}
                >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Verify OTP</h2>
                {message && <p className="text-red-700">{message}</p>}

                {/*OTP Input*/}
                <label className="block text-gray-700">Enter OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter Verification code"
                className="w-full px-4 py-2 border rounded-md focusing:ring-1 focus:ring-blue-500 focus:outline-none mb-4" required />

                {/*verify button */}
                <button 
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 my-4 w-full">
                Verify OTP
                </button>
                </form>
            ) : ( 
            <form 
                className="bg-white p-8 rounded-lg shadow-lg w-96"
                onSubmit={handleSignup} 
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Signup</h2>
                {message && <p className="text-red-700">{message}</p>}

                {/* Name */}
                <label className="block text-gray-700">Name</label>
                <input
                    type="text"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none mb-4"
                    required
                />

                {/* Email */}
                <label className="block text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none mb-4"
                    required
                />

                {/* Password */}
                <label className="block text-gray-700">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none mb-4"
                    required
                />

                {/* Confirm Password */}
                <label className="block text-gray-700">Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none mb-4"
                    required
                />

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 my-4 w-full"
                >
                    Signup
                </button>
                {/* Already have an account? Signin Link */}
                <div className="mt-4 flex justify-between text-sm text-gray-600">
                    <p className="text-black">Already have an account?</p>
                    <a href="/" className="text-blue-500 hover:underline">Signin</a>
                </div>
            </form>

            )}
           
        </div>
    );
}