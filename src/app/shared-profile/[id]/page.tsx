import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SharedProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const user = await getUserById(params.id);

  if (!user) {
    return redirect("/404");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar session={session} />

      <main className="flex-grow container mx-auto py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          {session ? (
            // Show limited profile information
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary-700">
                {user.fullName}'s Profile
              </h2>
              <div className="bg-white rounded-lg p-6 shadow-md">
                {/* Show limited public information */}
                <p className="text-gray-600">
                  {user.profile?.bio || "No bio available"}
                </p>
              </div>
            </div>
          ) : (
            // Show sign-in prompt for non-authenticated users
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-primary-700">
                Want to see more?
              </h2>
              <p className="text-gray-600">
                Sign in to view complete profile information and connect with {user.fullName}.
              </p>
              <Button
                asChild
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
} 