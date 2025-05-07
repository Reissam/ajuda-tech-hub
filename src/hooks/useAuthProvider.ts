
import { useState, useEffect } from "react";
import { User, UserRole } from "@/types/user";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { getOrCreateUserProfile } from "@/utils/authUtils";

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial session and set up authentication listener
  useEffect(() => {
    // Set up auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          const { id, email } = session.user;
          // Use setTimeout to avoid deadlocks
          setTimeout(() => {
            handleUserProfile(id, email || "");
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Getting existing session:", session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        const { id, email } = session.user;
        handleUserProfile(id, email || "");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle user profile fetching or creation
  const handleUserProfile = async (userId: string, email: string) => {
    try {
      const userProfile = await getOrCreateUserProfile(userId, email);
      if (userProfile) {
        setUser(userProfile);
      } else {
        toast.error("Erro ao carregar dados do usuário");
      }
    } catch (error) {
      toast.error("Erro ao carregar dados do usuário, mas você pode continuar usando o aplicativo");
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success("Login realizado com sucesso!");
      return;
    } catch (error: any) {
      const message = error.message || "Erro ao fazer login";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.info("Sessão encerrada");
    } catch (error: any) {
      toast.error(error.message || "Erro ao sair");
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });

      if (error) throw error;

      toast.success(`Cadastro realizado com sucesso! Verifique seu email.`);
      return;
    } catch (error: any) {
      const message = error.message || "Erro ao registrar";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    login,
    logout,
    register,
    isLoading
  };
};
