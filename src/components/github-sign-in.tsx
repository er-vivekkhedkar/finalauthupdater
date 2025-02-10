'use client';
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleGithubSignIn } from "@/lib/actions";
import { useFormStatus } from "react-dom";

const GithubButton = () => {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" variant="outline" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <span className="loading loading-spinner loading-sm mr-2"></span>
          Connecting...
        </>
      ) : (
        <>
          <Github className="mr-2 h-4 w-4" />
          Sign in with Github
        </>
      )}
    </Button>
  );
}

export function GithubSignIn() {
  return (
    <form action={handleGithubSignIn}>
      <GithubButton />
    </form>
  );
}
