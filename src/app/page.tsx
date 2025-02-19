"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WelcomeSection } from "@/components/WelcomeSection";
import { Toaster } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return null; // or your loading component
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar session={session} />
      <WelcomeSection session={session} />

      <main className="flex-grow container mx-auto py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700">
                Experience AI-Powered Conversations
              </h2>
              <p className="text-lg text-primary-600/80 mb-8">
                Get instant answers, coding help, and intelligent responses with our Gemini AI assistant.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg transition-all duration-300"
                >
                  <Bot className="w-6 h-6" />
                  <span className="text-lg">Start a Conversation</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}
