
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { toast } from "sonner";
import {
  Plus,
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  UserCog,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  created_at: Date;
}

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  active?: boolean;
  created_at: string;
}

const UsersManagement = () => {
  const { user } = useAuth();
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users from Supabase
  const { data: profilesData = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        console.log("Fetching users from Supabase...");
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          console.error("Error fetching profiles:", error);
          throw error;
        }
        
        console.log("Profiles data:", data);
        return data as ProfileData[];
      } catch (error: any) {
        console.error("Error in queryFn:", error);
        toast.error(`Erro ao carregar usuários: ${error.message}`);
        return [];
      }
    }
  });

  // Transform profiles data to match UserData interface
  const users: UserData[] = profilesData.map(profile => ({
    id: profile.id,
    name: profile.name || 'Sem nome',
    email: profile.email || 'Sem email',
    role: (profile.role as UserRole) || UserRole.CLIENT,
    active: profile.active !== undefined ? profile.active : true, // Default to true if not specified
    created_at: new Date(profile.created_at || new Date())
  }));

  useEffect(() => {
    console.log("Transformed users:", users);
  }, [users]);

  if (user?.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p className="text-muted-foreground mb-4">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (date: Date | string) => {
    try {
      return new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Data inválida";
    }
  };

  // Filtrar usuários com base nos filtros e busca
  const filteredUsers = users.filter((u) => {
    // Filtro por papel
    if (roleFilter !== "all" && u.role !== roleFilter) {
      return false;
    }

    // Filtro por status
    if (
      statusFilter !== "all" &&
      ((statusFilter === "active" && !u.active) ||
        (statusFilter === "inactive" && u.active))
    ) {
      return false;
    }

    // Filtro por busca (nome ou email)
    if (
      searchQuery &&
      !u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !u.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const handleAddUser = () => {
    toast.info("Funcionalidade de adicionar usuário será implementada em breve.");
  };

  const handleEditUser = (userId: string) => {
    toast.info(`Editar usuário com ID: ${userId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
        <Button onClick={handleAddUser}>
          <Plus size={16} className="mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Gerencie os usuários e suas permissões no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Papéis</SelectItem>
                <SelectItem value={UserRole.CLIENT}>Cliente</SelectItem>
                <SelectItem value={UserRole.TECHNICIAN}>Técnico</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                <SelectItem value={UserRole.MANAGER}>Gestor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingUsers ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Carregando usuários...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.role === UserRole.ADMIN
                              ? "bg-primary text-primary-foreground"
                              : user.role === UserRole.TECHNICIAN
                              ? "bg-warning text-primary-foreground"
                              : user.role === UserRole.MANAGER
                              ? "bg-info text-primary-foreground"
                              : ""
                          }
                        >
                          {user.role === UserRole.CLIENT
                            ? "Cliente"
                            : user.role === UserRole.TECHNICIAN
                            ? "Técnico"
                            : user.role === UserRole.MANAGER
                            ? "Gestor"
                            : "Admin"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.active ? "default" : "outline"}
                          className={user.active ? "bg-success" : ""}
                        >
                          {user.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditUser(user.id)}
                        >
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;
