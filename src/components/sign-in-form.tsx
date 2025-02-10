'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      callbackUrl: "/",
      redirect: false,
    }).then((response) => {
      if (response?.error) {
        toast("Account not found. Please sign up first.");
      } else if (response?.ok) {
        window.location.href = "/";
      }
    }).catch(() => {
      toast("Something went wrong. Please try again.");
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
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
                  Or continue with
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
                  autoComplete="current-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link 
                href="/sign-up" 
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 