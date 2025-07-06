"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

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
      });

      persistQueryClient({
        queryClient: client,
        persister,
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
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [queryClient]);
  return null;
}
