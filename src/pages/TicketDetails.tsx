import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Clock, MessageSquare, Send } from "lucide-react";

// Enums para status e prioridade
enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  WAITING = "waiting",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Interface para o tipo de chamado
interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
  clientId: string;
  clientName: string;
  technicianId?: string;
  technicianName?: string;
  comments: Comment[];
}

// Interface para comentários
interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  userId: string;
  userName: string;
  userRole: UserRole;
}

// Mock de um chamado para demonstração
const MOCK_TICKET: Ticket = {
  id: "123",
  title: "Problema com impressora",
  description: "A impressora não está conectando na rede. Já tentei reiniciar e verificar os cabos, mas continua sem funcionar.",
  status: TicketStatus.OPEN,
  priority: TicketPriority.MEDIUM,
  createdAt: new Date("2023-05-10T14:30:00"),
  updatedAt: new Date("2023-05-10T14:30:00"),
  clientId: "1",
  clientName: "Cliente Demo",
  comments: [
    {
      id: "c1",
      text: "Já verificou se o endereço IP está configurado corretamente?",
      createdAt: new Date("2023-05-10T15:45:00"),
      userId: "2",
      userName: "Técnico Demo",
      userRole: UserRole.TECHNICIAN,
    },
    {
      id: "c2",
      text: "Sim, o IP está correto. Também já tentei usar outro cabo de rede.",
      createdAt: new Date("2023-05-10T16:20:00"),
      userId: "1",
      userName: "Cliente Demo",
      userRole: UserRole.CLIENT,
    },
  ],
};

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"" | TicketStatus>("");
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    // Simulando carregamento de dados
    const loadTicket = async () => {
      try {
        // Em um cenário real, aqui faria uma chamada à API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTicket(MOCK_TICKET);
        setStatus(MOCK_TICKET.status);
      } catch (error) {
        toast.error("Erro ao carregar detalhes do chamado");
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id]);

  const handleStatusChange = async () => {
    if (!status) return;

    try {
      // Simulando atualização de status
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTicket((prev) => (prev ? { ...prev, status } : null));
      toast.success("Status atualizado com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !user) return;

    try {
      // Simulando envio de comentário
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newComment: Comment = {
        id: `c${Date.now()}`,
        text: comment,
        createdAt: new Date(),
        userId: user.id,
        userName: user.name,
        userRole: user.role,
      };

      setTicket((prev) =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : null
      );
      setComment("");
      toast.success("Comentário adicionado com sucesso");
    } catch (error) {
      toast.error("Erro ao adicionar comentário");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "bg-blue-500";
      case TicketStatus.IN_PROGRESS:
        return "bg-yellow-500";
      case TicketStatus.WAITING:
        return "bg-purple-500";
      case TicketStatus.RESOLVED:
        return "bg-green-500";
      case TicketStatus.CLOSED:
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW:
        return "bg-green-500";
      case TicketPriority.MEDIUM:
        return "bg-yellow-500";
      case TicketPriority.HIGH:
        return "bg-orange-500";
      case TicketPriority.CRITICAL:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "Aberto";
      case TicketStatus.IN_PROGRESS:
        return "Em Andamento";
      case TicketStatus.WAITING:
        return "Aguardando";
      case TicketStatus.RESOLVED:
        return "Resolvido";
      case TicketStatus.CLOSED:
        return "Fechado";
      default:
        return "Desconhecido";
    }
  };

  const getPriorityLabel = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW:
        return "Baixa";
      case TicketPriority.MEDIUM:
        return "Média";
      case TicketPriority.HIGH:
        return "Alta";
      case TicketPriority.CRITICAL:
        return "Crítica";
      default:
        return "Desconhecida";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p>Carregando detalhes do chamado...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Chamado não encontrado</h1>
        <p className="text-muted-foreground mb-4">
          O chamado que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={() => navigate("/tickets")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para lista de chamados
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/tickets")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Chamado #{ticket.id}
          </h1>
        </div>
        <div className="flex gap-2">
          <Badge className={getPriorityColor(ticket.priority)}>
            {getPriorityLabel(ticket.priority)}
          </Badge>
          <Badge className={getStatusColor(ticket.status)}>
            {getStatusLabel(ticket.status)}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{ticket.title}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Aberto em {formatDate(ticket.createdAt)} por {ticket.clientName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Descrição</h3>
              <p className="mt-2 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {(user?.role === UserRole.TECHNICIAN ||
              user?.role === UserRole.ADMIN) && (
              <div className="border rounded-md p-4 bg-muted/50">
                <h3 className="text-lg font-medium mb-2">Atualizar Status</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value as "" | TicketStatus)}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TicketStatus.OPEN}>Aberto</SelectItem>
                      <SelectItem value={TicketStatus.IN_PROGRESS}>
                        Em Andamento
                      </SelectItem>
                      <SelectItem value={TicketStatus.WAITING}>
                        Aguardando
                      </SelectItem>
                      <SelectItem value={TicketStatus.RESOLVED}>
                        Resolvido
                      </SelectItem>
                      <SelectItem value={TicketStatus.CLOSED}>
                        Fechado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleStatusChange}>Atualizar Status</Button>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Comentários</h3>
                <Badge variant="outline">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {ticket.comments.length}
                </Badge>
              </div>

              <div className="space-y-4">
                {ticket.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`flex gap-3 ${
                      comment.userId === user?.id
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {comment.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 max-w-[80%] ${
                        comment.userId === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex justify-between items-center gap-4 mb-1">
                        <span className="font-medium text-sm">
                          {comment.userName}
                        </span>
                        <span className="text-xs opacity-70">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Adicionar Comentário</h3>
              <div className="space-y-4">
                <Textarea
                  placeholder="Digite seu comentário aqui..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
                {(user?.role === UserRole.TECHNICIAN ||
                  user?.role === UserRole.ADMIN) && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="internal"
                      checked={isInternal}
                      onCheckedChange={() => setIsInternal(!isInternal)}
                    />
                    <label
                      htmlFor="internal"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Comentário interno (visível apenas para técnicos e
                      administradores)
                    </label>
                  </div>
                )}
                <Button
                  onClick={handleCommentSubmit}
                  disabled={!comment.trim()}
                  className="w-full sm:w-auto"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Comentário
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">
            Última atualização: {formatDate(ticket.updatedAt)}
          </div>
          {(user?.role === UserRole.ADMIN ||
            (user?.role === UserRole.TECHNICIAN &&
              ticket.status !== TicketStatus.CLOSED)) && (
            <Button variant="outline" color="red">
              {ticket.status === TicketStatus.CLOSED
                ? "Reabrir Chamado"
                : "Fechar Chamado"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TicketDetails;
