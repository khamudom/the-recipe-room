/**
 * Client-Side Supabase Configuration
 *
 * This file creates and exports the main Supabase client instance for use in
 * client-side components and hooks. It's configured with the browser-specific
 * client that handles authentication, real-time subscriptions, and database
 * operations in the browser environment.
 *
 * Configuration:
 * - Uses environment variables for URL and API key
 * - Configured for browser/client-side usage
 * - Handles authentication state management
 * - Supports real-time subscriptions
 *
 * Usage:
 * - Import this supabase instance in client components
 * - Use for authentication, database queries, and real-time features
 * - This is the primary client for all client-side Supabase operations
 *
 * Note: For server-side operations, use the auth-helpers.ts file instead.
 */

import { createBrowserClient } from "@supabase/ssr";

// Create and export the main Supabase client for client-side usage
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
