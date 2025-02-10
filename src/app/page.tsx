import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileUpdater from "@/components/profile-update";
import { Toaster } from "sonner";
import { getUserProfile } from "@/lib/actions";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Page = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");
  
  // Fetch user data at the page level
  const user = await getUserProfile();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar session={session} />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Profile</h2>
            <p className="text-gray-600">Update your information and manage your account settings.</p>
          </div>
          {user ? (
            <ProfileUpdater initialUser={user} />
          ) : (
            redirect("/sign-in")
          )}
        </div>
      </main>

      <Footer />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgb(99 102 241)',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default Page;
