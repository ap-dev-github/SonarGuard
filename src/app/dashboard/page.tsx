"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "@/components/AlertMessage";
import {jwtDecode} from "jwt-decode"; 
import Members from "@/components/Members"; 
import RadarReading from "@/components/RadarReading";
import { MembersProvider } from "@/contexts/MemberContext";


export default function Dashboard() {
    const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const token = localStorage.getItem("token");
  // Show alert
  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    if (type === "success") {
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
  };

  useEffect(() => {
    
   
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // Check if token is expired
        const currentTime = Date.now() / 1000; // in seconds
        if (decoded.exp < currentTime) {
          setAuth(false);
          localStorage.removeItem("token");
          showAlert("Session expired. Please log in again", "error");
          router.push("/");
        } else {
          setAuth(true);
          showAlert("Access Granted to Dashboard", "success");
        }
      } catch (error) {
        setAuth(false);
        localStorage.removeItem("token");
        showAlert("Invalid token. Please log in again", "error");
        router.push("/");
      }
    } else {
      setAuth(false);
      showAlert("Access Denied. Please log in", "error");
      router.push("/");
    }
  }, [router]);

  return (
    <div>
      {auth ? (
        <>
          {alert && <AlertMessage message={alert.message} type={alert.type} />}
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 p-4 gap-40">
          <MembersProvider>
          <Members/> 
          <RadarReading/>  
          </MembersProvider>    
          </div>
        </>
      ) : (
        <>
          {alert && <AlertMessage message={alert.message} type={alert.type} />}
        </>
      )}
    </div>
  );
}
