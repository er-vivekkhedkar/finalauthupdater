"use client";

import { SignOut } from "./sign-out";
import type { Session } from "next-auth";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const container = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0 }
};

interface NavbarProps {
  session: Session | null;
}

export function Navbar({ session }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header 
      initial="hidden"
      animate="show"
      variants={container}
      className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div variants={itemAnimation}>
            <Link 
              href="/" 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700"
            >
              Profile App
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            variants={itemAnimation}
            className="hidden md:flex items-center space-x-8"
          >
            {session ? (
              <>
                <Link 
                  href="/"
                  className="text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/profile/edit"
                  className="text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Edit Profile
                </Link>
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-primary-100">
                      <AvatarImage src={session.user?.image || undefined} />
                      <AvatarFallback className="bg-primary-50 text-primary-600">
                        {session.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <SignOut />
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/sign-in"
                  className="text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.nav>

          {/* Mobile Menu Button */}
          <motion.button
            variants={itemAnimation}
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-slate-600" />
            ) : (
              <Menu className="h-6 w-6 text-slate-600" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 space-y-4"
          >
            {session ? (
              <>
                <Link 
                  href="/"
                  className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/profile/edit"
                  className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Edit Profile
                </Link>
                <div className="px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || undefined} />
                      <AvatarFallback className="bg-primary-50 text-primary-600">
                        {session.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-slate-600">{session.user?.name}</span>
                  </div>
                  <SignOut />
                </div>
              </>
            ) : (
              <div className="space-y-2 p-4">
                <Link 
                  href="/sign-in"
                  className="block w-full px-4 py-2 text-center text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up"
                  className="block w-full px-4 py-2 text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
} 