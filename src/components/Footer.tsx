"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Twitter, Linkedin, Heart, Bot } from "lucide-react";

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
      className="w-full bg-white/80 backdrop-blur-sm border-t"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div variants={itemAnimation} className="space-y-4">
            <Link 
              href="/" 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700 flex items-center gap-2"
            >
              <Bot className="w-6 h-6" />
              QuickChat AI
            </Link>
            <p className="text-slate-600 max-w-xs">
              Experience intelligent conversations powered by Gemini AI. Fast, reliable, and always ready to help.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemAnimation} className="space-y-4">
            <h3 className="font-semibold text-lg text-slate-900">Resources</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link 
                href="/" 
                className="text-slate-600 hover:text-primary-600 transition-colors"
              >
                API Docs
              </Link>
              <Link 
                href="/" 
                className="text-slate-600 hover:text-primary-600 transition-colors"
              >
                Privacy
              </Link>
              <Link 
                href="/" 
                className="text-slate-600 hover:text-primary-600 transition-colors"
              >
                Terms
              </Link>
              <Link 
                href="/" 
                className="text-slate-600 hover:text-primary-600 transition-colors"
              >
                Support
              </Link>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemAnimation} className="space-y-4">
            <h3 className="font-semibold text-lg text-slate-900">Connect</h3>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          variants={itemAnimation}
          className="mt-8 pt-8 border-t border-slate-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div 
              className="flex items-center space-x-2 text-slate-600"
              whileHover={{ scale: 1.02 }}
            >
              <span>Powered by</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <Bot className="w-4 h-4 text-primary-500" />
              </motion.div>
              <span>Gemini AI</span>
            </motion.div>
            <motion.p 
              variants={itemAnimation}
              className="text-slate-600"
            >
              © {currentYear} QuickChat AI. All rights reserved.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
} 