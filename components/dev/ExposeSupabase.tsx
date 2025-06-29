/**
 * ExposeSupabase Component
 *
 * This component exposes the Supabase client to the global window object
 * for debugging and development purposes. It allows access to the Supabase
 * instance from the browser console for testing and troubleshooting.
 *
 * Note: This should only be used in development environments.
 */
"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    supabase: typeof supabase;
  }
}

export function ExposeSupabase() {
  useEffect(() => {
    window.supabase = supabase;
  }, []);
  return null;
}
