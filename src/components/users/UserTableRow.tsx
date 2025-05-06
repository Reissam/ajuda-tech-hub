
import { 
  MoreHorizontal, 
  UserCog, 
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRole } from "@/types/user";
import { TableRow, TableCell } from "@/components/ui/table";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  created_at: Date;
}

interface UserTableRowProps {
  user: UserData;
  onEditUser: (userId: string) => void;
  onToggleStatus: (userId: string, currentStatus: boolean) => void;
  formatDate: (date: Date | string) => string;
  getInitials: (name: string) => string;
}

export const UserTableRow = ({
  user,
  onEditUser,
  onToggleStatus,
  formatDate,
  getInitials
}: UserTableRowProps) => {
  return (
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
            <DropdownMenuItem onClick={() => onEditUser(user.id)}>
              <UserCog className="mr-2 h-4 w-4" />
              Editar usuário
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus(user.id, user.active)}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              {user.active ? "Desativar" : "Ativar"} usuário
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
