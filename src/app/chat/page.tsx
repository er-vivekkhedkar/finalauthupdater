import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatInterface } from "@/components/chat-interface";
import { Toaster } from "sonner";

export default async function ChatPage() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar session={session} />
      
      <main className="flex-grow container mx-auto py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <ChatInterface />
        </div>
      </main>

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
} 