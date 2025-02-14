import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileUpdater from "@/components/profile-update";
import { Toaster } from "sonner";
import { getUserProfile } from "@/lib/actions";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const EditProfilePage = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");
  
  const user = await getUserProfile();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar session={session} />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Edit Profile</h2>
            <p className="text-gray-600">Update your profile information.</p>
          </div>
          <ProfileUpdater initialUser={user} />
        </div>
      </main>

      <Footer />
      <Toaster position="top-center" />
    </div>
  );
};

export default EditProfilePage; 