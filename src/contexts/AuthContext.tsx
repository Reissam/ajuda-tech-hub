
import { createContext, useContext, useState, ReactNode } from "react";
import { AuthContextType, User, UserRole } from "@/types/user";
import { toast } from "sonner";

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: "1",
    name: "Cliente Demo",
    email: "cliente@demo.com",
    password: "cliente123",
    role: UserRole.CLIENT
  },
  {
    id: "2",
    name: "Técnico Demo",
    email: "tecnico@demo.com",
    password: "tecnico123",
    role: UserRole.TECHNICIAN
  },
  {
    id: "3",
    name: "Admin Demo",
    email: "admin@demo.com",
    password: "admin123",
    role: UserRole.ADMIN
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("ajudaHubUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulando delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Credenciais inválidas");
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("ajudaHubUser", JSON.stringify(userWithoutPassword));
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao fazer login";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ajudaHubUser");
    toast.info("Sessão encerrada");
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulando delay de registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error("Email já está em uso");
      }
      
      // Em um cenário real, isso enviaria dados para uma API
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        role: UserRole.CLIENT
      };
      
      setUser(newUser);
      localStorage.setItem("ajudaHubUser", JSON.stringify(newUser));
      toast.success("Registro realizado com sucesso!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao registrar";
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
