"use client"
import AWS from 'aws-sdk';
import React, { useEffect, useState } from "react";
import { CognitoUserAttribute, CognitoUser,CognitoUserPool, ISignUpResult } from "amazon-cognito-identity-js";
import { userPool } from "../../../utils/cognitoConfig";
import AlertMessage from '@/components/AlertMessage';


export default function Signup() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [alert, setAlert] = useState<{message: string; type: "success"|"error"}|null>(null);
    

    //show alert function
    const showAlert = (message: string, type: "success" | "error") => {
        setAlert({message,type});
        
        if(type === "success"){
            setTimeout(() => {
               setAlert(null);
            },3000);}
    };

    // AWS Cognito required attributes
    const attributes = [
        new CognitoUserAttribute({ Name: "email", Value: email }),
        new CognitoUserAttribute({ Name: "name", Value: name }),
    ];


    //check User Verfication function
    AWS.config.update({
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        region: process.env.NEXT_PUBLIC_AWS_REGION,
      });
    const congnito = new AWS.CognitoIdentityServiceProvider({ region:process.env.NEXT_APP_AWS_REGION});
    async function checkUserEmailVerification(username: string, userPoolId: string) {
        try {
            const response = await congnito.adminGetUser({
               UserPoolId: userPoolId,
               Username: username 
            }).promise();
            const emailVerifiedAttr =response.UserAttributes?.find(attr => attr.Name === "email_verified");
            return emailVerifiedAttr?.Value === "true";
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    }
  

    //get CognitoUser
    const getCognitoUser = () => new CognitoUser({Username: email, Pool: userPool });


    //handle Signup
    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showAlert("Passwords do not match!","error");
            return;
        } 
        userPool.signUp(email, password, attributes, [], (err, data?: ISignUpResult) => {
            interface CognitoError extends Error {
                code?: string;
            }
            if (err) {      
               if ((err as CognitoError).code === "UsernameExistsException") {
                try{
                   checkUserEmailVerification(email, process.env.NEXT_APP_COGNITO_USER_POOL_ID as string).then(emailVerified => {
                    if (emailVerified === null) {
                        showAlert("Error retrieving user information.","error");
                    } else if (!emailVerified) {
                        resendConfirmationCode();
                        showAlert("User not verified. Verfication code resent!","error");
                    } else{
                        showAlert("User already exist. Plese log in.","error");
                    }
                   });
                }
                catch (error) {
                    showAlert("An error occurred while processing your request. ","error");
                }
               } else {
                showAlert("An unexpected error occurred.","error");
                console.log("error occured while user verification signup");
               } 
            } else {
                console.log("Signup Successful:", data);
                showAlert("Signup successful! Please verify your email.","success");
                setIsVerifying(true);
            }
        });
    };

    //resend otp if user already exist
    const resendConfirmationCode = () => {
        const user = getCognitoUser();
        user.resendConfirmationCode((err, result) => {
        if(err) {
            console.log("Error resending code:", err.message);
            showAlert(err.message,"error");
        } else {
            console.log("OTP resent successfully:", result);
            showAlert("Verification code resent! Check your email.","success");
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
            showAlert(err.message,"error");
        } else {
            console.log("Verification Successful:",result);
            showAlert("Verification successful! You can login in.","success");
            setIsVerifying(false);
        }
    }) ; 
    };
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            {isVerifying ? (
                <form 
                className="bg-white p-8 rounded-lg shadow-lg w-96"
                onSubmit={handleVerifyOtp}
                >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Verify OTP</h2>
                {/*Display Message*/}
                {alert && <AlertMessage message={alert.message} type={alert.type}/>}
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
                 {/*Display Message*/}
                 {alert && <AlertMessage message={alert.message} type={alert.type}/>}

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
                <div className="mt-4 flex text-sm text-gray-600">
                    <p className="text-black">Already have an account?</p>
                    <a href="/" className="text-blue-500 hover:underline">Login</a>
                </div>
            </form>
            )}       
        </div>
    );
}