
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { Plus, ArrowUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserFilters } from "@/components/users/UserFilters";
import { UsersTable } from "@/components/users/UsersTable";
import { formatDate, getInitials } from "@/utils/userUtils";
import { useUserManagement } from "@/hooks/useUserManagement";

const UsersManagement = () => {
  const { user } = useAuth();
  const {
    isLoading,
    filteredUsers,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    handleAddUser,
    handleEditUser,
    handleToggleUserStatus,
    handleRefreshUsers
  } = useUserManagement();

  useEffect(() => {
    console.log("Transformed users:", filteredUsers);
  }, [filteredUsers]);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshUsers} disabled={isLoading}>
            {isLoading ? (
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
          <UserFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <UsersTable
            isLoading={isLoading}
            filteredUsers={filteredUsers}
            onEditUser={handleEditUser}
            onToggleStatus={handleToggleUserStatus}
            formatDate={formatDate}
            getInitials={getInitials}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;
