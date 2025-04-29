
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/contexts/TicketContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { TicketStatus, TicketPriority, TicketCategory } from "@/types/ticket";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

const TicketsList = () => {
  const navigate = useNavigate();
  const { tickets } = useTickets();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrar tickets com base no papel do usuário
  const filteredTickets = tickets.filter((ticket) => {
    // Filtro por papel do usuário
    if (user?.role === UserRole.CLIENT && ticket.createdBy !== user.id) {
      return false;
    }
    if (user?.role === UserRole.TECHNICIAN && ticket.assignedTo !== user.id) {
      return false;
    }

    // Filtro por status
    if (statusFilter !== "all" && ticket.status !== statusFilter) {
      return false;
    }

    // Filtro por busca (título ou ID)
    if (
      searchQuery &&
      !ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ticket.id.includes(searchQuery)
    ) {
      return false;
    }

    return true;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Chamados</h1>
        {(user?.role === UserRole.CLIENT || user?.role === UserRole.MANAGER) && (
          <Button onClick={() => navigate("/tickets/new")}>
            <Plus size={16} className="mr-2" />
            Novo Chamado
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Chamados</CardTitle>
          <CardDescription>
            {user?.role === UserRole.CLIENT
              ? "Seus chamados abertos"
              : user?.role === UserRole.TECHNICIAN
              ? "Chamados atribuídos a você"
              : "Todos os chamados do sistema"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID ou título..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value={TicketStatus.OPEN}>Aberto</SelectItem>
                <SelectItem value={TicketStatus.IN_PROGRESS}>Em Andamento</SelectItem>
                <SelectItem value={TicketStatus.RESOLVED}>Resolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="hidden md:table-cell">Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">#{ticket.id}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <CategoryBadge category={ticket.category} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(ticket.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum chamado encontrado
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

export default TicketsList;
