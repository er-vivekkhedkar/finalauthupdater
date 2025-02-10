import { SignOut } from "./sign-out";
import type { Session } from "next-auth";
import Link from "next/link";

interface NavbarProps {
  session: Session | null;
}

export const Navbar = ({ session }: NavbarProps) => {
  return (
    <header className="w-full bg-slate-900 text-white shadow-lg border-b border-slate-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center min-h-16">
        <div className="flex items-center space-x-4">
          <Link href="/" className="group transition duration-300">
            <h1 className="text-2xl font-bold text-white relative flex items-center">
              <svg 
                className="w-6 h-6 mr-2 text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Profile Updater
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <span className="hidden md:flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium text-slate-200">{session?.user?.email}</span>
          </span>
          <SignOut />
        </div>
      </div>
    </header>
  );
}; 