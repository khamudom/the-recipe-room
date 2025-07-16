"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { recipeKeys } from "@/hooks/use-recipes-query";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes
          retry: 3,
          refetchOnWindowFocus: false, // Disable refetch on window focus to prevent unnecessary requests
          refetchOnReconnect: true,
          refetchOnMount: false, // Don't refetch when component mounts if data exists
        },
      },
    });

    return client;
  });

  // Handle hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryAuthSync />
      {children}
      {/* {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}

function ReactQueryAuthSync() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        queryClient.clear();
      } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        // Invalidate queries but don't force immediate refetch
        queryClient.invalidateQueries({ queryKey: recipeKeys.all });
        queryClient.invalidateQueries({ queryKey: ["category-counts"] });

        // Only refetch category counts immediately as they're critical for navigation
        queryClient.refetchQueries({ queryKey: ["category-counts"] });
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [queryClient]);
  return null;
}
