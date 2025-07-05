import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/auth-context";
import { Navigation } from "../components/layout/navigation/navigation";
import { ExposeSupabase } from "@/components/dev/ExposeSupabase";
import { LottiePreloader } from "@/components/ui/lottie-preloader/lottie-preloader";
import { AIChefWidget } from "@/components/features/ai-chef/ai-chef-widget";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "The Recipe Room",
  description: "A vintage-style recipe collection app",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ReactQueryProvider>
          <AuthProvider>
            {/* Only expose Supabase in development */}
            {process.env.NODE_ENV === "development" && <ExposeSupabase />}
            <LottiePreloader />
            <Navigation />
            <main>{children}</main>
            <AIChefWidget />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
