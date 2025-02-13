import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner";
import { Toaster as ReactHotToastToaster } from 'react-hot-toast';





const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['sans-serif'],
});

const metadata: Metadata = {
  title: "Profile Updater",
  description: "Update your profile information with ease.",
};

type LayoutProps = {
  children: ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <main className="flex items-center justify-center bg-gray-100">
          <div className="bg-white rounded-lg w-full">
            {children}
          </div>
        </main>
        <Toaster />
        <SonnerToaster />
        <ReactHotToastToaster />
      </body>
    </html>
  );
};

export { metadata };
export default Layout;
