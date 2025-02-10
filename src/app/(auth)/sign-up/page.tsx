import { SignUpForm } from "@/components/sign-up-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await auth();
  if (session) redirect("/");
  
  return <SignUpForm />;
}
