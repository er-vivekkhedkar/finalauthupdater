import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner";
import { Toaster as ReactHotToastToaster } from 'react-hot-toast';
import { SessionProvider } from "next-auth/react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['sans-serif'],
});

const metadata: Metadata = {
  title: "QuickChatAI",
  description: "QuickChatAI is a chatbot that can help you with your questions.",
};

type LayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <SessionProvider session={session}>
          <main className="flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg w-full">
              {children}
            </div>
          </main>
          <Toaster />
          <SonnerToaster />
          <ReactHotToastToaster />
        </SessionProvider>
      </body>
    </html>
  );
}

export { metadata };
