/**
 * Server-Side Authentication Helpers
 *
 * This file provides utility functions for handling authentication on the server side
 * in Next.js applications using Supabase. These helpers are specifically designed for
 * Server Components and API routes where client-side authentication context is not available.
 *
 * Key Features:
 * - Server-side Supabase client creation with cookie management
 * - User authentication state retrieval on the server
 * - Proper cookie handling for SSR authentication
 * - Error handling for authentication failures
 *
 * Use Cases:
 * - Server Components that need user authentication
 * - API routes requiring user verification
 * - Middleware authentication checks
 * - Server-side rendering with user context
 *
 * Note: These helpers work alongside the client-side auth context but provide
 * server-side authentication capabilities for SSR scenarios.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Create a Supabase client configured for server-side usage
// Handles cookie management for authentication state persistence
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Get all cookies for authentication state
        getAll() {
          return cookieStore.getAll();
        },
        // Set cookies for authentication state persistence
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// Get the currently authenticated user on the server side
// Returns null if no user is authenticated or if there's an error
export async function getCurrentUser() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
