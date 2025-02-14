'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, type KeyboardEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle2, RefreshCw } from "lucide-react"

const container = {
  hidden: { opacity: 0, y: 20 },
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface VerificationFormProps {
  email: string;
}

export function VerificationForm({ email }: VerificationFormProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const verificationCode = code.join("");
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          code: verificationCode 
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Account created successfully!");
        router.push('/sign-in?verified=true');
      } else {
        setError(data.message || 'Invalid verification code');
        toast.error(data.message || 'Invalid verification code');
      }
    } catch (error) {
      setError('Failed to verify code');
      toast.error('Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setCode(["", "", "", "", "", ""]);
        toast.success('New verification code sent', {
          icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
        });
      }
    } catch (error) {
      toast.error('Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
          <CardHeader className="space-y-3 text-center pb-8">
            <motion.div variants={itemAnimation}>
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700">
                Verify your email
              </CardTitle>
              <CardDescription className="text-base mt-2">
                We've sent a verification code to
                <div className="font-medium text-primary-600 mt-1">{email}</div>
              </CardDescription>
            </motion.div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <motion.div 
                variants={itemAnimation}
                className="flex justify-center gap-2 sm:gap-3"
              >
                {code.map((digit, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="\d{1}"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      ref={(el) => { inputs.current[index] = el }}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-lg font-semibold p-0 
                        bg-white/50 backdrop-blur-sm border-primary-100 
                        focus:border-primary-500 focus:ring-primary-500 
                        transition-all duration-200
                        shadow-sm hover:shadow-md"
                      required
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 scale-x-0 origin-left"
                      animate={{ scaleX: digit ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                ))}
              </motion.div>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 text-red-600 text-sm p-3 rounded-md text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-4 pb-8">
              <motion.div variants={itemAnimation} className="w-full">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-primary-600 to-primary-700 
                    hover:from-primary-700 hover:to-primary-600 
                    text-white shadow-lg hover:shadow-xl 
                    transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </motion.div>
              <motion.button
                variants={itemAnimation}
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="text-sm text-primary-600 hover:text-primary-700 
                  transition-colors underline underline-offset-4
                  flex items-center space-x-2"
              >
                {isResending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                ) : (
                  "Resend code"
                )}
              </motion.button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
} 