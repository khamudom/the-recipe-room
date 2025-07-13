"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
        },
      },
    });

    // Set up persistence if we're on the client side
    if (typeof window !== "undefined") {
      const persister = createSyncStoragePersister({
        storage: window.localStorage,
        // Add serialization options to handle potential issues
        serialize: (data: unknown) => JSON.stringify(data),
        deserialize: (data: string) => JSON.parse(data),
      });

      persistQueryClient({
        queryClient: client,
        persister,
        // Add options to handle persistence issues
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        buster: "v1", // Add a version buster
      });
    }

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
        // Invalidate all recipe-related queries including category counts
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
        queryClient.invalidateQueries({ queryKey: ["category-counts"] });
        queryClient.invalidateQueries({ queryKey: recipeKeys.all });
        // Also invalidate any queries that might be user-specific
        queryClient.invalidateQueries({ queryKey: ["featured"] });
        queryClient.invalidateQueries({ queryKey: ["search"] });

        // Force refetch critical queries immediately
        queryClient.refetchQueries({ queryKey: ["category-counts"] });
        queryClient.refetchQueries({ queryKey: ["recipes"] });
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [queryClient]);
  return null;
}
