
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { Ticket, TicketContextType } from "./ticketTypes";
import { 
  fetchTickets, 
  createTicket, 
  updateTicketById, 
  addTicketComment 
} from "./ticketApi";

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTickets = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const ticketsData = await fetchTickets();
      setTickets(ticketsData);
    } catch (error) {
      console.error("Error loading tickets:", error);
      toast.error("Erro ao carregar tickets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  const addTicket = async (
    ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "comments">
  ) => {
    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const newTicket = await createTicket(ticketData, user.id);
      setTickets(prev => [...prev, newTicket]);
      toast.success("Chamado aberto com sucesso!");
      return Promise.resolve();
    } catch (error) {
      console.error("Erro ao abrir chamado:", error);
      toast.error("Erro ao abrir chamado");
      throw error;
    }
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    try {
      await updateTicketById(id, updates);
      
      // Update local state
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === id
            ? { ...ticket, ...updates, updatedAt: new Date() }
            : ticket
        )
      );
      toast.success("Chamado atualizado com sucesso!");
      return Promise.resolve();
    } catch (error) {
      console.error("Erro ao atualizar chamado:", error);
      toast.error("Erro ao atualizar chamado");
      throw error;
    }
  };

  const getTicketById = (id: string) => {
    return tickets.find(ticket => ticket.id === id);
  };

  const assignTicket = async (ticketId: string, technicianId: string) => {
    try {
      await updateTicket(ticketId, { assignedTo: technicianId });
      toast.success("Chamado atribuído com sucesso!");
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  };

  const addComment = async (ticketId: string, content: string, attachments?: string[]) => {
    if (!user) return Promise.reject("Usuário não autenticado");

    try {
      const newComment = await addTicketComment(ticketId, content, user.id, attachments);

      // Update local state with the new comment
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                comments: [...(ticket.comments || []), newComment],
                updatedAt: new Date()
              }
            : ticket
        )
      );
      toast.success("Comentário adicionado!");
      return Promise.resolve();
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      toast.error("Erro ao adicionar comentário");
      throw error;
    }
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
