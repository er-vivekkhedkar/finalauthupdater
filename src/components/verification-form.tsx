'use client';

import { useState, useRef, type KeyboardEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface VerificationFormProps {
  email: string;
}

export function VerificationForm({ email }: VerificationFormProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setCode(["", "", "", "", "", ""]);
        toast.success('New verification code sent');
      }
    } catch (error) {
      toast.error('Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription className="text-base">
            We've sent a verification code to
            <div className="font-medium text-primary mt-1">{email}</div>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-3">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{1}"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => { inputs.current[index] = el }}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold p-0"
                  required
                />
              ))}
            </div>
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <Button 
              type="submit" 
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
            <button
              type="button"
              onClick={handleResendCode}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Resend code
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 