/**
 * Authentication Context Provider
 *
 * This file provides a React Context for managing authentication state throughout the application.
 * It wraps Supabase authentication functionality and provides a clean interface for components
 * to access user authentication data and perform auth operations.
 *
 * Features:
 * - Manages user session state (user, session, loading)
 * - Provides sign out functionality
 * - Automatically syncs with Supabase auth state changes
 * - Handles initial session loading
 *
 * Usage:
 * - Wrap your app with <AuthProvider> in the root layout
 * - Use useAuth() hook in components to access auth state
 * - Components can access: user, session, loading, signOut
 *
 * Example:
 * const { user, loading, signOut } = useAuth();
 */

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State to track current user, session, and loading status
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Set up real-time listener for authentication state changes
    // This will fire whenever the user signs in, signs out, or their session changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Clean up subscription when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  // Function to handle user sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // The auth state change listener will automatically update the state
      // when the sign out is successful
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Create the context value object
  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
