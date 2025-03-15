import Link from "next/link";

const NavBar = () => {
return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-2xl">SonarGuard</h1>
      <div className="space-x-4">
        <Link href="/" className="text-xl text-white hover:text-blue-200">Home</Link>
        <Link href="/login" className="text-xl text-white hover:text-blue-200">Login</Link>
      </div>
    </nav>
);
};
export default NavBar;