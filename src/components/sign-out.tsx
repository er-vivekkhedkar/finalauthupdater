"use client";

import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export function SignOut() {
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => signOut({ callbackUrl: '/sign-in' })}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg
        bg-gradient-to-r from-primary-600/10 to-primary-700/10 hover:from-primary-600/20 hover:to-primary-700/20
        text-primary-700
        transition-all duration-200 ease-in-out
        border border-primary-200 hover:border-primary-300
        focus:outline-none focus:ring-2 focus:ring-primary-500/40
        shadow-sm hover:shadow-md"
    >
      <motion.div
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
      >
        <LogOut className="w-4 h-4" />
      </motion.div>
      <span className="font-medium">Sign Out</span>
    </motion.button>
  );
}
