"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Function to check authentication status
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); //  Converts token existence to true/false
  };

  useEffect(() => {
    checkAuth(); 

   
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange); 
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token"); 
    setIsLoggedIn(false); 
    router.push("/"); 
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <nav className="bg-blue-600 text-white p-3 flex justify-between ">
      <h1 className="text-2xl">SonarGuard</h1>
      <div className="space-x-4">
        <Link href="/" className="text-xl text-white hover:text-blue-200">Home</Link>
        {!isLoggedIn && (
          <Link href="/" className="bg-green-500 px-4 py-2 rounded transition-all hover:bg-green-600">
            Sign In
          </Link>
        )}
        {isLoggedIn && (
          <>
           <Link href="/dashboard" className="text-xl text-white hover:text-blue-200">Dashboard</Link>
          <button onClick={handleSignOut} className="bg-yellow-500 px-4 py-2 text-white rounded-2xl drop-shadow-lg hover:bg-yellow-600 transition-all">
            Sign Out
          </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
