
export enum UserRole {
  CLIENT = "client",
  TECHNICIAN = "technician",
  ADMIN = "admin",
  MANAGER = "manager"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address?: string;
  state?: string;
  city?: string;
  unit?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
}
