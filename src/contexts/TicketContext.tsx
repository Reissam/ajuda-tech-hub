
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Ticket, TicketStatus, TicketPriority, TicketCategory, TicketComment } from "@/types/ticket";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "comments">) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  getTicketById: (id: string) => Ticket | undefined;
  assignTicket: (ticketId: string, technicianId: string) => Promise<void>;
  addComment: (ticketId: string, content: string, attachments?: string[]) => Promise<void>;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Buscar tickets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('*, ticket_comments(*)');
      
      if (ticketsError) {
        throw ticketsError;
      }

      if (!ticketsData) {
        setTickets([]);
        return;
      }

      // Transformar os dados para o formato esperado pela aplicação
      const formattedTickets: Ticket[] = ticketsData.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status as TicketStatus,
        priority: ticket.priority as TicketPriority,
        category: ticket.category as TicketCategory,
        createdAt: new Date(ticket.created_at),
        updatedAt: new Date(ticket.updated_at),
        createdBy: ticket.created_by || '',
        assignedTo: ticket.assigned_to,
        clientId: ticket.client_id,
        comments: ticket.ticket_comments ? ticket.ticket_comments.map((comment: any) => ({
          id: comment.id,
          content: comment.content,
          createdAt: new Date(comment.created_at),
          createdBy: comment.created_by,
          attachments: comment.attachments ? 
            (Array.isArray(comment.attachments) ? 
              comment.attachments.map(a => String(a)) : 
              [String(comment.attachments)]
            ) : []
        })) : []
      }));

      setTickets(formattedTickets);
    } catch (error) {
      console.error("Erro ao carregar tickets:", error);
      toast.error("Erro ao carregar tickets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const addTicket = async (
    ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "comments">
  ) => {
    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      console.log("Enviando dados do ticket para o Supabase:", ticketData);

      // Inserir novo ticket no Supabase
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          title: ticketData.title,
          description: ticketData.description,
          status: ticketData.status,
          priority: ticketData.priority,
          category: ticketData.category,
          created_by: user.id,
          client_id: ticketData.clientId
        }])
        .select('*')
        .single();
      
      if (error) {
        console.error("Erro detalhado do Supabase:", error);
        throw error;
      }

      console.log("Ticket criado com sucesso:", data);

      // Adicionar o novo ticket ao estado local
      const newTicket: Ticket = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status as TicketStatus,
        priority: data.priority as TicketPriority,
        category: data.category as TicketCategory,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        createdBy: data.created_by || user.id,
        assignedTo: data.assigned_to,
        clientId: data.client_id,
        comments: []
      };

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
      // Preparar dados para atualização
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.status) updateData.status = updates.status;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.category) updateData.category = updates.category;
      if (updates.assignedTo) updateData.assigned_to = updates.assignedTo;
      
      // Atualizar no Supabase
      const { error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        throw error;
      }

      // Atualizar estado local
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
      // Inserir comentário no Supabase
      const { data, error } = await supabase
        .from('ticket_comments')
        .insert([{
          ticket_id: ticketId,
          content,
          created_by: user.id,
          attachments: attachments || null
        }])
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }

      // Criar novo comentário para o estado local
      const newComment: TicketComment = {
        id: data.id,
        content: data.content,
        createdAt: new Date(data.created_at),
        createdBy: data.created_by,
        attachments: data.attachments ? 
          (Array.isArray(data.attachments) ? 
            data.attachments.map(a => String(a)) : 
            [String(data.attachments)]
          ) : []
      };

      // Atualizar estado local
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
