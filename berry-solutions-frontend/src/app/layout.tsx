import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Berry Solutions - School Management",
  description: "School Management System by Berry Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased flex min-h-screen bg-slate-50 text-slate-900 font-sans transition-all duration-300">
        <Sidebar />
        <main className="flex-1 lg:ml-72 p-4 sm:p-8 md:p-12 transition-all duration-300 w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto animation-fade-in py-10 lg:py-4">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
