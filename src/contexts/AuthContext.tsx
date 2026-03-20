"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { User, Session } from "@supabase/supabase-js";
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
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Singleton Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setInitialized(true);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
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
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
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
    } catch (error: any) {
      return { error };
    }
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
    signOut,
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
