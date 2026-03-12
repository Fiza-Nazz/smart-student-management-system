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
        <main className="flex-1 ml-72 p-8 sm:p-12 transition-all duration-300">
          <div className="max-w-7xl mx-auto animation-fade-in">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
