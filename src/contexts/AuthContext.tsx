"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SupabaseClient, User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { UserProfile, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isSuperAdmin: boolean;
  hasRole: (roles: UserRole[]) => boolean;
  signIn: (email: string, password: string) => Promise<{ data?: any; error: any }>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: any }>;
  signInWithMagicLink: (
    email: string,
    opts?: { data?: Record<string, unknown>; shouldCreateUser?: boolean },
  ) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROFILE_FETCH_TIMEOUT_MS = 5000;

const fetchProfileWithTimeout = async (
  userId: string,
): Promise<UserProfile | null> => {
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Profile fetch timeout")),
        PROFILE_FETCH_TIMEOUT_MS,
      ),
    );

    const query = supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const { data, error } = await Promise.race([query, timeout]);
    if (error) throw error;
    return data as UserProfile;
  } catch (error: any) {
    if (error?.message?.includes("Lock") || error?.message?.includes("timeout")) {
      console.warn("Profile fetch skipped:", error.message);
    } else {
      console.error("Error fetching profile:", error);
    }
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // onAuthStateChange fires INITIAL_SESSION on subscribe in supabase-js v2,
    // so we don't need a separate getSession() call (avoids dual profile fetch).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profileData = await fetchProfileWithTimeout(session.user.id);
        if (isMounted) setProfile(profileData);
      } else {
        setProfile(null);
      }

      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });
    return { error };
  };

  const signInWithMagicLink = async (
    email: string,
    opts?: { data?: Record<string, unknown>; shouldCreateUser?: boolean },
  ) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: opts?.data,
        shouldCreateUser: opts?.shouldCreateUser ?? true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!profile) return false;
    return roles.includes(profile.role);
  };

  const isAdmin = profile?.role === "super_admin";
  const isStaff = profile?.role === "super_admin" || profile?.role === "staff";
  const isSuperAdmin = profile?.role === "super_admin";

  const value = {
    user,
    session,
    profile,
    loading,
    isAdmin,
    isStaff,
    isSuperAdmin,
    hasRole,
    signIn,
    signUp,
    signInWithMagicLink,
    signInWithGoogle,
    signOut,
    supabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
