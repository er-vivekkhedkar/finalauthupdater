import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileUpdater from "@/components/profile-update";
import { Toaster } from "sonner";
import { getUserProfile } from "@/lib/actions";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ProfileView from "@/components/profile-view";

const Page = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");
  
  // Fetch user data at the page level
  const user = await getUserProfile();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar session={session} />

      <main className="flex-grow container mx-auto py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <div className="mb-6 sm:mb-8 fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700 transition-transform duration-300 hover:scale-[1.01]">
              Your Profile
            </h2>
            <p className="text-sm sm:text-base text-primary-600/80 hover:text-primary-600 transition-colors duration-300">
              Update your information and manage your account settings.
            </p>
          </div>
          {user ? (
            <ProfileView user={user} />
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
