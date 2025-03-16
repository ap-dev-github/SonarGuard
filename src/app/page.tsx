"use client"
import React, { Key, useState } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import {userPool} from "@/utils/cognitoConfig";
import AlertMessage from "@/components/AlertMessage";
import { useRouter } from "next/navigation";


export default function Login(){
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [isForgetPassword, setIsForgetPassword] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error"}|null>(null);

    const getCognitoUser = () => new CognitoUser({Username: email, Pool: userPool});
     
    //alert function
    const showAlert = (message: string, type: "success" | "error") => {
        setAlert({message, type});
        if(type === "success"){
        setTimeout(() => {
           setAlert(null);
        },3000);}
    }

    const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!email || !newPassword || !confirmPassword) {
            showAlert("Please fill all fields.", "error");
            return;
        }
    
        if (newPassword !== confirmPassword) {
            showAlert("Passwords do not match.", "error");
            return;
        }
    
        const user = getCognitoUser();
    
        if (!isVerifying) {
            // Step 1: Send OTP
            user.forgotPassword({
                onSuccess: (data) => {
                    console.log("OTP sent:", data);
                    showAlert("OTP sent! Check your email.", "success");
                    setIsVerifying(true); // Now show the OTP input field
                },
                onFailure: (err) => {
                    console.log("Forgot Password Error:", err.message);
                    showAlert(err.message, "error");
                },
            });
        } else {
            // Step 2: Verify OTP and reset password
            if (!otp) {
                showAlert("Please enter the OTP.", "error");
                return;
            }
    
            user.confirmPassword(otp, newPassword, {
                onSuccess: () => {
                    console.log("Password reset Successful!");
                    showAlert("Password reset successful! You can now log in.", "success");
                    setIsForgetPassword(false);
                    setIsVerifying(false);
                    setOtp(""); // Clear OTP field
                },
                onFailure: (err) => {
                    console.error("Reset Password Error:", err.message);
                    showAlert(err.message, "error");
                },
            });
        }
    };
    
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //Authentication Details 
        const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
        });

        //Cognito User 
        const user = getCognitoUser();

        //Sign in the user 
        user.authenticateUser(authDetails, {
            onSuccess: (session) => {
            console.log("Login Successful:", session);
            showAlert("Login Successful:","success");
            localStorage.setItem("token", session.getIdToken().getJwtToken());
            window.dispatchEvent(new Event("storage"));  //notify the storage evenchage
            router.push('/dashboard');
           
            },
            onFailure: (err) => {
                console.error("Login failed:", err);
                showAlert(err.message || "Login failed. Please try again.","error");
              },
        });
    
    };
    return(
        <div className=" min-h-screen flex justify-center backdrop-blur-2xl items-center rounded-sm shadow-sm"  style={{
            backgroundImage: "url('/bg-image.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
            <form  onSubmit={isForgetPassword ? handleResetPassword : handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-96">
             <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {isForgetPassword ? "Reset Password" : "Login"}
                </h2>

             {/* Email*/}
             <label className="block text-grey-700">Email</label>
             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
             placeholder="Enter your email" className="w-full px-4 py-2 border rounded-md 
             focus:ring-1 focus:ring-blue-500 focus:outline-none mb-4" required/>

             {/*Conditional Redenring: Login vd Forgot Password*/}
             {!isForgetPassword ?
             (
                <>
                   {/*Password*/}
             <label className="block text-grey-700">Password</label>
             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
             placeholder="Enter your password" className="w-full px-4 py-2 border 
             rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none mb-4" required />
               </>  
             ):(
                <>
                {/*OTP Input*/}
                {isVerifying && (
                   <>
                   <label className="block text-gray-700">Enter OTP</label> 
                   <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                   placeholder="Enter OTP sent on your email"
                   className="w-full px-4 py-2 border rounded-md focus:ring-1
                    focus:ring-blue-500 focus:outline-none mb-4"
                    />
                </>
                )}
                { /* New Password Input*/}
                <label className="block text-grey-700">New Password</label>
                <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none mb-4"
                            required
                        />
                  {/**confirm Password**/}
             <label className="block text-grey-700">Confirm Password</label>
             <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
             placeholder="Re-enter password" className="w-full px-4 py-2 border 
             rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none mb-4" required />         
                </>
             )} 
            {/*Display Message*/}
                {alert && <AlertMessage message={alert.message} type={alert.type}/>}
               
            
            {/*Submit Button*/}
             <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all
             my-4">{isForgetPassword ? "Reset Password" : "Login"}</button>

             {/*Forget Password and Signup Links */}
             <div className="mt-4 flex justify-between text-sm text-gray-600">
                {!isForgetPassword ? (
                    <a href="#" onClick={() => setIsForgetPassword(true)}   className=" text-black hover:underline">Forget Password?</a>
                ):(
                    <a href="#" className="text-black hover:underline" onClick={() => setIsForgetPassword(false)}>
                        Back to Login
                    </a>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                <p className="text-black ">Don't have account?</p>
                <a href="/auth/signup" className="text-blue-500 hover:underline px-1"> Signup</a>
                </div>
             </div>
            </form>
        </div>
    );
};