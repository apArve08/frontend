import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { Activity } from "lucide-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Running Analyzer",
  description: "AI-powered performance insights, Malaysian-context meal tracking, and comprehensive health metrics.",
};

function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/20">
                <Activity className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                RunAnalyzer
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link
                href="/analyze-run"
                className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Run AI
              </Link>
              <Link
                href="/analyze-meal"
                className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Meal AI
              </Link>
              <Link
                href="/health-checker"
                className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/schedules"
                className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Schedules
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen text-white`}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
