"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "@/components/AlertMessage";
import {jwtDecode} from "jwt-decode"; 
 

export default function Dashboard() {
    const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);
 

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
    const token = localStorage.getItem("token");
    console.log("token details:", token);

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
           <h1>Welcome to the dashboard</h1>
          {alert && <AlertMessage message={alert.message} type={alert.type} />}
        </>
      ) : (
        <>
          <h1>Access Denied!</h1>
          {alert && <AlertMessage message={alert.message} type={alert.type} />}
          <button onClick={() => router.push("/")}>Login</button>
        </>
      )}
    </div>
  );
}
