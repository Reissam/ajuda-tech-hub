
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRole } from "@/types/user";
import { UserTableRow } from "./UserTableRow";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  created_at: Date;
}

interface UsersTableProps {
  isLoading: boolean;
  filteredUsers: UserData[];
  onEditUser: (userId: string) => void;
  onToggleStatus: (userId: string, currentStatus: boolean) => void;
  formatDate: (date: Date | string) => string;
  getInitials: (name: string) => string;
}

export const UsersTable = ({
  isLoading,
  filteredUsers,
  onEditUser,
  onToggleStatus,
  formatDate,
  getInitials
}: UsersTableProps) => {
  return (
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
          {isLoading ? (
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
              <UserTableRow 
                key={user.id}
                user={user}
                onEditUser={onEditUser}
                onToggleStatus={onToggleStatus}
                formatDate={formatDate}
                getInitials={getInitials}
              />
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
  );
};
