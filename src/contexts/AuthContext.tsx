
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthContextType, User, UserRole } from "@/types/user";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar sessão inicial e configurar listener para mudanças de autenticação
  useEffect(() => {
    // Configurar o listener para mudanças de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          const { id, email } = session.user;
          // Não fazemos chamadas ao Supabase dentro do callback
          // Usamos setTimeout para evitar deadlocks
          setTimeout(() => {
            getOrCreateUserProfile(id, email || "");
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // DEPOIS verificamos a sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Getting existing session:", session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        const { id, email } = session.user;
        getOrCreateUserProfile(id, email || "");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função para buscar ou criar perfil do usuário
  const getOrCreateUserProfile = async (userId: string, email: string) => {
    try {
      console.log(`Checking profile for user ${userId} (${email})`);
      
      // Primeiro tentamos buscar o perfil com .select() em vez de .single()
      const { data: profiles, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);

      if (fetchError) {
        console.error("Error fetching profiles:", fetchError);
        throw fetchError;
      }

      // Verifica se encontrou algum perfil
      if (profiles && profiles.length > 0) {
        console.log("Profile found:", profiles[0]);
        const profile = profiles[0];
        
        const userWithProfile: User = {
          id: userId,
          email,
          name: profile.name,
          role: profile.role as UserRole
        };
        
        setUser(userWithProfile);
        return;
      }
      
      console.log(`No profile found for ${userId}, creating new profile`);
      
      // Determinamos o papel com base no email
      let role = UserRole.CLIENT;
      let name = email.split('@')[0];
      
      if (email.includes("admin")) {
        role = UserRole.ADMIN;
        name = "Admin Demo";
      } else if (email.includes("gestor")) {
        role = UserRole.MANAGER;
        name = "Gestor Demo";
      } else if (email.includes("tecnico")) {
        role = UserRole.TECHNICIAN;
        name = "Técnico Demo";
      }

      // Criamos o perfil
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: userId, 
            email, 
            name,
            role
          }
        ])
        .select();

      if (insertError) {
        console.error("Error creating profile:", insertError);
        // Em vez de lançar o erro, criamos um usuário manualmente para permitir o login
        const fallbackUser: User = {
          id: userId,
          email,
          name,
          role
        };
        setUser(fallbackUser);
        toast.error("Erro ao criar perfil, mas você pode continuar usando o aplicativo");
        return;
      }

      if (newProfile && newProfile.length > 0) {
        console.log("New profile created:", newProfile[0]);
        
        const userWithProfile: User = {
          id: userId,
          email,
          name: newProfile[0].name,
          role: newProfile[0].role as UserRole
        };
        
        setUser(userWithProfile);
      } else {
        // Caso de fallback
        const fallbackUser: User = {
          id: userId,
          email,
          name,
          role
        };
        setUser(fallbackUser);
      }
    } catch (error) {
      console.error("Erro ao buscar/criar perfil:", error);
      // Em caso de erro, criamos um usuário manualmente para permitir o login
      const fallbackUser: User = {
        id: userId,
        email,
        name: email.includes("admin") ? "Admin Demo" : email.split('@')[0],
        role: email.includes("admin") ? UserRole.ADMIN : UserRole.CLIENT
      };
      setUser(fallbackUser);
      toast.error("Erro ao carregar dados do usuário, mas você pode continuar usando o aplicativo");
    }
  };

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

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
