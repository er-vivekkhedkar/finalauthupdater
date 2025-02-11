'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";
import { signUp } from "@/lib/actions";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await signUp(formData);
      if (res.success) {
        toast("Account created successfully! Please sign in.");
        window.location.href = '/sign-in';
      } else {
        toast(res.message ?? "Something went wrong");
      }
    } catch {
      toast("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex min-h-screen w-full items-center justify-center px-4 py-10"
      suppressHydrationWarning={true}
    >
      <Card className="w-full max-w-lg mx-auto">
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link 
                href="/sign-in" 
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 