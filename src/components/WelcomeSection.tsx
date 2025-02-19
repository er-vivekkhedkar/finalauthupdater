"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";

interface WelcomeSectionProps {
  session: Session | null;
}

export function WelcomeSection({ session }: WelcomeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/50 backdrop-blur-sm border-b border-primary-100/50"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-700">
                Welcome, {session?.user?.name || 'User'}! 👋
              </h1>
              <p className="text-slate-600 mt-2">
                Ready to chat with our AI assistant? Get started now!
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg transition-all duration-300"
              >
                <Bot className="w-5 h-5" />
                <span>Start Chatting</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 