
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/contexts/ticket";
import { TicketStatus } from "@/types/ticket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
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

const TechnicianOpenTickets = ({ userId }: { userId: string }) => {
  const { tickets, updateTicket } = useTickets();
  const navigate = useNavigate();
  
  // Filter tickets assigned to this technician and that are open or in progress
  const assignedOpenTickets = tickets.filter(
    (ticket) => 
      ticket.assignedTo === userId && 
      (ticket.status === TicketStatus.OPEN || ticket.status === TicketStatus.IN_PROGRESS)
  );

  const [ticketStatuses, setTicketStatuses] = useState<Record<string, TicketStatus>>(
    assignedOpenTickets.reduce((acc, ticket) => {
      acc[ticket.id] = ticket.status;
      return acc;
    }, {} as Record<string, TicketStatus>)
  );

  const handleStatusChange = async (ticketId: string, status: TicketStatus) => {
    setTicketStatuses(prev => ({ ...prev, [ticketId]: status }));
    try {
      await updateTicket(ticketId, { status });
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    }
  };

  // Function to generate number of OS based on the ID
  const generateOrderNumber = (id: string) => {
    // Take the first 6 characters of the ID to create an OS number
    const shortId = id.substring(0, 6).toUpperCase();
    return `OS-${shortId}`;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Chamados Atribuídos a Você</CardTitle>
      </CardHeader>
      <CardContent>
        {assignedOpenTickets.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Nº de OS</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedOpenTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    {generateOrderNumber(ticket.id)}
                  </TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>
                    <PriorityBadge priority={ticket.priority} />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={ticketStatuses[ticket.id]}
                      onValueChange={(value) => 
                        handleStatusChange(ticket.id, value as TicketStatus)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue>
                          <StatusBadge status={ticketStatuses[ticket.id]} />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TicketStatus.OPEN}>
                          <div className="flex items-center">
                            <StatusBadge status={TicketStatus.OPEN} />
                          </div>
                        </SelectItem>
                        <SelectItem value={TicketStatus.IN_PROGRESS}>
                          <div className="flex items-center">
                            <StatusBadge status={TicketStatus.IN_PROGRESS} />
                          </div>
                        </SelectItem>
                        <SelectItem value={TicketStatus.RESOLVED}>
                          <div className="flex items-center">
                            <StatusBadge status={TicketStatus.RESOLVED} />
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-4">Nenhum chamado aberto atribuído a você.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicianOpenTickets;
