'use client';
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function GithubSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signIn("github", { 
        callbackUrl: "/",
        redirect: false,
      });
      
      if (result?.error) {
        toast.error("Failed to sign in with GitHub");
      } else if (result?.ok) {
        toast.success("Signed in successfully!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("GitHub sign in error:", error);
      toast.error("Failed to sign in with GitHub");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleGithubSignIn}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        "Connecting..."
      ) : (
        <>
          <Github className="mr-2 h-4 w-4" />
          Sign in with Github
        </>
      )}
    </Button>
  );
}
