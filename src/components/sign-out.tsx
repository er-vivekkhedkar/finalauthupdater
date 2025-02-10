"use client";

import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/sign-in' })}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg
        bg-slate-800 hover:bg-slate-700 
        text-slate-200 hover:text-white
        transition-all duration-200 ease-in-out
        border border-slate-700 hover:border-slate-600
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span className="font-medium">Sign Out</span>
    </button>
  );
}
