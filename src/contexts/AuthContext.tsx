
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
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          const { id, email } = session.user;
          // Não fazemos chamadas ao Supabase dentro do callback
          // Usamos setTimeout para evitar deadlocks
          setTimeout(() => {
            fetchUserProfile(id, email || "");
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // DEPOIS verificamos a sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const { id, email } = session.user;
        fetchUserProfile(id, email || "");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função para buscar o perfil do usuário
  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      // Por enquanto, como não temos uma tabela de perfis configurada no Supabase,
      // vamos retornar um perfil baseado no email
      let role = UserRole.TECHNICIAN;
      let name = "Usuário";
      
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

      const userWithProfile: User = {
        id: userId,
        email,
        name,
        role
      };
      
      setUser(userWithProfile);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      toast.error("Erro ao carregar dados do usuário");
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
      return data;
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

  const register = async (name: string) => {
    // Esta função é usada apenas para registro de clientes
    // e não afeta a autenticação, então a mantemos sem alterações
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Cliente ${name} cadastrado com sucesso!`);
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
