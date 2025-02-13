'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GithubIcon, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { VerificationForm } from "@/components/verification-form";

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Verification code sent to your email");
        setShowVerificationForm(true);
      } else {
        setError(data.message || 'Registration failed');
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        <p>We've sent a verification code to {formData.email}</p>
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Input
              key={i}
              type="text"
              maxLength={1}
              className="w-12 text-center"
              value={verificationCode[i] || ''}
              onChange={(e) => {
                const newCode = verificationCode.split('');
                newCode[i] = e.target.value;
                setVerificationCode(newCode.join(''));
                if (e.target.value && e.target.nextElementSibling) {
                  (e.target.nextElementSibling as HTMLInputElement).focus();
                }
              }}
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <>
      {!showVerificationForm ? (
        <div className="container flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Enter your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <Button 
                  variant="outline" 
                  onClick={() => signIn("github", { callbackUrl: "/" })}
                  className="w-full"
                >
                  <GithubIcon className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        autoComplete="new-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 hover:text-primary"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-red-500">{error}</p>}
                  <Button 
                    type="submit" 
                    className="w-full h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </form>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link 
                    href="/verify" 
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <VerificationForm email={formData.email} />
      )}
    </>
  );
} 