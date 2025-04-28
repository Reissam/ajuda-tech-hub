
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTickets } from "@/contexts/TicketContext";
import { UserRole } from "@/types/user";
import { TicketStatus } from "@/types/ticket";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTicketById, updateTicket, addComment } = useTickets();
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState<TicketStatus | "">("");

  if (!id) {
    navigate("/tickets");
    return null;
  }

  const ticket = getTicketById(id);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Chamado não encontrado</h1>
        <Button onClick={() => navigate("/tickets")}>Voltar para Chamados</Button>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleStatusChange = () => {
    if (!newStatus) return;
    updateTicket(ticket.id, { status: newStatus as TicketStatus });
    setNewStatus("");
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addComment(ticket.id, newComment);
    setNewComment("");
  };

  const canUpdateStatus =
    user?.role === UserRole.ADMIN || (user?.role === UserRole.TECHNICIAN && ticket.assignedTo === user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Chamado #{ticket.id}
          </h1>
          <p className="text-muted-foreground">
            Aberto em {formatDate(ticket.createdAt)}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/tickets")}>
          Voltar para Chamados
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <div>{ticket.title}</div>
              <StatusBadge status={ticket.status} />
            </CardTitle>
            <CardDescription className="flex flex-wrap gap-2 mt-1">
              <CategoryBadge category={ticket.category} />
              <PriorityBadge priority={ticket.priority} />
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Descrição</h3>
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </div>

            <Separator className="my-4" />

            <div>
              <h3 className="font-medium mb-4">Histórico de Atualizações</h3>

              {ticket.comments && ticket.comments.length > 0 ? (
                <div className="space-y-4">
                  {ticket.comments.map((comment) => (
                    <div key={comment.id} className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {getInitials("User")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {comment.createdBy === user?.id ? "Você" : "Técnico"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Nenhuma atualização disponível</p>
              )}
            </div>

            {(user?.role === UserRole.TECHNICIAN || user?.role === UserRole.ADMIN) && (
              <form onSubmit={handleAddComment} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Adicionar nova observação..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={!newComment.trim()}>
                    Adicionar Comentário
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="text-sm font-medium">
                  <StatusBadge status={ticket.status} />
                </div>

                <div className="text-sm text-muted-foreground">Prioridade</div>
                <div className="text-sm font-medium">
                  <PriorityBadge priority={ticket.priority} />
                </div>

                <div className="text-sm text-muted-foreground">Categoria</div>
                <div className="text-sm font-medium">
                  <CategoryBadge category={ticket.category} />
                </div>

                <div className="text-sm text-muted-foreground">Data de abertura</div>
                <div className="text-sm font-medium">{formatDate(ticket.createdAt)}</div>

                <div className="text-sm text-muted-foreground">
                  Última atualização
                </div>
                <div className="text-sm font-medium">{formatDate(ticket.updatedAt)}</div>
              </div>
            </CardContent>
          </Card>

          {canUpdateStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Atualizar Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o novo status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TicketStatus.OPEN}>Aberto</SelectItem>
                    <SelectItem value={TicketStatus.IN_PROGRESS}>
                      Em Andamento
                    </SelectItem>
                    <SelectItem value={TicketStatus.RESOLVED}>
                      Resolvido
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleStatusChange}
                  className="w-full"
                  disabled={!newStatus}
                >
                  Atualizar Status
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
