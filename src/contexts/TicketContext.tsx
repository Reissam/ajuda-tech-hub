
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from "@/types/ticket";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "comments">) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  getTicketById: (id: string) => Ticket | undefined;
  assignTicket: (ticketId: string, technicianId: string) => void;
  addComment: (ticketId: string, content: string, attachments?: string[]) => void;
}

// Mock data
const MOCK_TICKETS: Ticket[] = [
  {
    id: "1",
    title: "Problema com impressora",
    description: "A impressora não está conectando com a rede",
    status: TicketStatus.OPEN,
    priority: TicketPriority.MEDIUM,
    category: TicketCategory.HARDWARE,
    createdBy: "1", // Cliente
    clientId: "1", // Adicionando clientId
    createdAt: new Date("2023-04-25T10:00:00Z"),
    updatedAt: new Date("2023-04-25T10:00:00Z"),
    comments: []
  },
  {
    id: "2",
    title: "Software travando",
    description: "O sistema de faturamento trava ao gerar notas",
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.HIGH,
    category: TicketCategory.SOFTWARE,
    createdBy: "1", // Cliente
    assignedTo: "2", // Técnico
    clientId: "2", // Adicionando clientId
    createdAt: new Date("2023-04-24T14:30:00Z"),
    updatedAt: new Date("2023-04-24T15:45:00Z"),
    comments: [
      {
        id: "c1",
        content: "Iniciando análise do problema",
        createdBy: "2", // Técnico
        createdAt: new Date("2023-04-24T15:45:00Z")
      }
    ]
  },
  {
    id: "3",
    title: "Internet instável",
    description: "Conexão caindo frequentemente no setor de vendas",
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.HIGH,
    category: TicketCategory.NETWORK,
    createdBy: "1", // Cliente
    assignedTo: "2", // Técnico
    clientId: "3", // Adicionando clientId
    createdAt: new Date("2023-04-20T09:15:00Z"),
    updatedAt: new Date("2023-04-22T11:30:00Z"),
    comments: [
      {
        id: "c2",
        content: "Identificado problema no roteador",
        createdBy: "2", // Técnico
        createdAt: new Date("2023-04-21T10:30:00Z")
      },
      {
        id: "c3",
        content: "Roteador substituído e problema resolvido",
        createdBy: "2", // Técnico
        createdAt: new Date("2023-04-22T11:30:00Z")
      }
    ]
  }
];

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Simulando carregamento de tickets de uma API
    const loadTickets = async () => {
      // Em um cenário real, isso seria uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      setTickets(MOCK_TICKETS);
    };

    if (user) {
      loadTickets();
    }
  }, [user]);

  const addTicket = (
    ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "comments">
  ) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `${tickets.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: []
    };

    setTickets(prev => [...prev, newTicket]);
    toast.success("Chamado aberto com sucesso!");
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === id
          ? { ...ticket, ...updates, updatedAt: new Date() }
          : ticket
      )
    );
    toast.success("Chamado atualizado com sucesso!");
  };

  const getTicketById = (id: string) => {
    return tickets.find(ticket => ticket.id === id);
  };

  const assignTicket = (ticketId: string, technicianId: string) => {
    updateTicket(ticketId, { assignedTo: technicianId });
    toast.success("Chamado atribuído com sucesso!");
  };

  const addComment = (ticketId: string, content: string, attachments?: string[]) => {
    if (!user) return;

    const newComment = {
      id: `c${Date.now()}`,
      content,
      createdBy: user.id,
      createdAt: new Date(),
      attachments
    };

    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? {
              ...ticket,
              comments: [...ticket.comments, newComment],
              updatedAt: new Date()
            }
          : ticket
      )
    );
    toast.success("Comentário adicionado!");
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicket,
        getTicketById,
        assignTicket,
        addComment
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketProvider");
  }
  return context;
};
