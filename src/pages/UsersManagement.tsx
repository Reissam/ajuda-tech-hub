
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from "sonner";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock users para demonstração
const MOCK_USERS = [
  {
    id: "1",
    name: "Cliente Demo",
    email: "cliente@demo.com",
    role: UserRole.CLIENT,
    active: true,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    name: "Técnico Demo",
    email: "tecnico@demo.com",
    role: UserRole.TECHNICIAN,
    active: true,
    createdAt: new Date("2023-02-10"),
  },
  {
    id: "3",
    name: "Admin Demo",
    email: "admin@demo.com",
    role: UserRole.ADMIN,
    active: true,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "4",
    name: "José Silva",
    email: "jose@exemplo.com",
    role: UserRole.CLIENT,
    active: true,
    createdAt: new Date("2023-03-22"),
  },
  {
    id: "5",
    name: "Maria Oliveira",
    email: "maria@exemplo.com",
    role: UserRole.CLIENT,
    active: false,
    createdAt: new Date("2023-03-15"),
  },
  {
    id: "6",
    name: "Carlos Técnico",
    email: "carlos@exemplo.com",
    role: UserRole.TECHNICIAN,
    active: true,
    createdAt: new Date("2023-02-28"),
  },
];

const UsersManagement = () => {
  const { user } = useAuth();
  const [users] = useState(MOCK_USERS);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
        <Button onClick={handleAddUser}>
          <UserPlus size={16} className="mr-2" />
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
                {filteredUsers.length > 0 ? (
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
                              : ""
                          }
                        >
                          {user.role === UserRole.CLIENT
                            ? "Cliente"
                            : user.role === UserRole.TECHNICIAN
                            ? "Técnico"
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
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
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
