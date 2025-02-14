"use client";

import { SignOut } from "./sign-out";
import type { Session } from "next-auth";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
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

const navItemHover = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const titleAnimation = {
  animate: {
    y: [-1, 1, -1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    }
  }
};

const lineAnimation = {
  animate: {
    x: ["-100%", "100%"],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    }
  }
};

const glowAnimation = {
  animate: {
    opacity: [0.4, 1, 0.4],
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    }
  }
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
          {/* Logo with moving line */}
          <motion.div 
            variants={itemAnimation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link href="/" className="relative group">
              <motion.div
                animate={titleAnimation.animate}
                className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600"
              >
                Profile App
              </motion.div>

              {/* Moving line */}
              <div className="relative h-0.5 w-full overflow-hidden">
                <motion.div
                  animate={lineAnimation.animate}
                  className="absolute inset-0 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                />
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            variants={itemAnimation}
            className="hidden md:flex items-center space-x-8"
          >
            {session ? (
              <>
                <motion.div
                  variants={navItemHover}
                  whileHover="hover"
                >
                  <Link 
                    href="/"
                    className="text-slate-600 hover:text-primary-600 transition-colors relative group"
                  >
                    Dashboard
                    <motion.span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                    />
                  </Link>
                </motion.div>
                
                <motion.div
                  variants={navItemHover}
                  whileHover="hover"
                >
                  <Link 
                    href="/profile/edit"
                    className="text-slate-600 hover:text-primary-600 transition-colors relative group"
                  >
                    Edit Profile
                    <motion.span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                    />
                  </Link>
                </motion.div>

                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-primary-100 hover:ring-primary-200 transition-all duration-300">
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
                <motion.div
                  variants={navItemHover}
                  whileHover="hover"
                >
                  <Link 
                    href="/sign-in"
                    className="text-slate-600 hover:text-primary-600 transition-colors relative group"
                  >
                    Sign In
                    <motion.span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                    />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/sign-up"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.nav>

          {/* Mobile Menu Button */}
          <motion.button
            variants={itemAnimation}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-primary-600" />
            ) : (
              <Menu className="h-6 w-6 text-primary-600" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden py-4 space-y-4"
          >
            {session ? (
              <>
                <motion.div
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link 
                    href="/"
                    className="block px-4 py-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link 
                    href="/profile/edit"
                    className="block px-4 py-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Edit Profile
                  </Link>
                </motion.div>
                <div className="px-4 py-2 flex items-center justify-between bg-primary-50/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Avatar className="h-8 w-8 ring-2 ring-primary-100">
                        <AvatarImage src={session.user?.image || undefined} />
                        <AvatarFallback className="bg-primary-50 text-primary-600">
                          {session.user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <span className="text-slate-600">{session.user?.name}</span>
                  </div>
                  <SignOut />
                </div>
              </>
            ) : (
              <div className="space-y-2 p-4">
                <motion.div
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link 
                    href="/sign-in"
                    className="block w-full px-4 py-2 text-center text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    href="/sign-up"
                    className="block w-full px-4 py-2 text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
} 