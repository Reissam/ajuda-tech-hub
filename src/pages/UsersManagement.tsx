
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
  Loader2,
  RefreshCw,
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
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users from Supabase
  const { data: profilesData = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        console.log("Fetching users from Supabase...");
        
        // Primeiro, verifica se existem perfis
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('name', { ascending: true });
        
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          throw profilesError;
        }
        
        console.log("Profiles found:", profiles?.length || 0);
        console.log("Profiles data:", profiles);
        
        // Se não há perfis, tenta buscar usuários da auth e criar perfis para eles
        if (!profiles || profiles.length === 0) {
          console.log("No profiles found, trying to fetch auth users and create profiles");
          
          // Buscar informações do usuário atual para determinar se é admin
          const { data: currentUserData } = await supabase.auth.getUser();
          const currentUser = currentUserData?.user;
          
          if (currentUser && currentUser.email?.includes('admin')) {
            console.log("Current user is admin, creating profiles for auth users");
            
            // Apenas para debug - na prática, seria ideal usar uma função do Supabase para isto
            const dummyProfiles = [
              {
                id: currentUser.id,
                name: 'Admin Demo',
                email: currentUser.email,
                role: 'admin',
                active: true,
                created_at: new Date().toISOString()
              }
            ];
            
            // Criar perfil para o usuário admin atual
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(dummyProfiles);
              
            if (insertError) {
              console.error("Error creating profile for admin:", insertError);
            } else {
              console.log("Created profile for admin user");
              return dummyProfiles as ProfileData[];
            }
          }
        }
        
        return profiles as ProfileData[];
      } catch (error: any) {
        console.error("Error in queryFn:", error);
        toast.error(`Erro ao carregar usuários: ${error.message}`);
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
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

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ active: !currentStatus })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      toast.success(`Status do usuário atualizado com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast.error(`Erro ao atualizar status: ${error.message}`);
    }
  };

  const handleRefreshUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    toast.info("Atualizando lista de usuários...");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshUsers} disabled={isLoadingUsers}>
            {isLoadingUsers ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ArrowUpDown size={16} className="mr-2" />
            )}
            Atualizar
          </Button>
          <Button onClick={handleAddUser}>
            <Plus size={16} className="mr-2" />
            Adicionar Usuário
          </Button>
        </div>
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
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                        <span>Carregando usuários...</span>
                      </div>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal size={16} />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                              <UserCog className="mr-2 h-4 w-4" />
                              Editar usuário
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, user.active)}>
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              {user.active ? "Desativar" : "Ativar"} usuário
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
