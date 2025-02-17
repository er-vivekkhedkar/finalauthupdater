import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProfileView } from "@/components/profile-view";
import { getUserProfile } from "@/lib/actions";
import { Toaster } from "sonner";

const ProfileViewPage = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const user = await getUserProfile();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar session={session} />

      <main className="flex-grow container mx-auto py-8 sm:py-12">
        <ProfileView user={user} />
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

export default ProfileViewPage; 