import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/auth-context";
import { Navigation } from "../components/layout/navigation/navigation";
import { ExposeSupabase } from "@/components/dev/ExposeSupabase";
import { LottiePreloader } from "@/components/ui/lottie-preloader/lottie-preloader";
import { AIChefWidget } from "@/components/features/ai-chef/ai-chef-widget";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { PageTransition } from "@/components/ui/page-transition/page-transition";
import { ServiceWorkerUpdateHandler } from "@/components/ui/service-worker-update-handler/service-worker-update-handler";

export const metadata: Metadata = {
  title: "The Recipe Room",
  description: "A vintage-style recipe collection app",
  icons: {
    icon: "/favrecipebox.webp",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#b48a78" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="The Recipe Room" />
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
      </head>
      <body suppressHydrationWarning={true}>
        <ReactQueryProvider>
          <AuthProvider>
            {/* Only expose Supabase in development */}
            {process.env.NODE_ENV === "development" && <ExposeSupabase />}
            <LottiePreloader />
            <Navigation />
            <PageTransition>
              <main>{children}</main>
            </PageTransition>
            <AIChefWidget />
            <ServiceWorkerUpdateHandler />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
