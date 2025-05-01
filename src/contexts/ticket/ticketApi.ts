
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Ticket, TicketComment } from "./ticketTypes";
import { TicketStatus, TicketPriority, TicketCategory, TicketType, TicketDescriptionType } from "@/types/ticket";

export async function fetchTickets(): Promise<Ticket[]> {
  try {
    // Fetch tickets from Supabase
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('tickets')
      .select('*, ticket_comments(*)');
    
    if (ticketsError) {
      throw ticketsError;
    }

    if (!ticketsData) {
      return [];
    }

    // Transform the data to match our application format
    const formattedTickets: Ticket[] = ticketsData.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      ticketType: ticket.ticket_type as TicketType || TicketType.PREVENTIVE_MAINTENANCE,
      ticketDescription: ticket.ticket_description as TicketDescriptionType || TicketDescriptionType.MECHANICAL_LOCK,
      description: ticket.description,
      reportedIssue: ticket.reported_issue,
      confirmedIssue: ticket.confirmed_issue,
      servicePerformed: ticket.service_performed,
      status: ticket.status as TicketStatus,
      priority: ticket.priority as TicketPriority,
      category: ticket.category as TicketCategory,
      createdAt: new Date(ticket.created_at),
      updatedAt: new Date(ticket.updated_at),
      createdBy: ticket.created_by || '',
      assignedTo: ticket.assigned_to,
      clientId: ticket.client_id,
      underWarranty: ticket.under_warranty,
      isWorking: ticket.is_working,
      serviceCompleted: ticket.service_completed,
      clientVerified: ticket.client_verified,
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

    return formattedTickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
}

export async function createTicket(
  ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "comments">,
  userId: string
): Promise<Ticket> {
  try {
    // Insert new ticket to Supabase
    const { data, error } = await supabase
      .from('tickets')
      .insert([{
        title: ticketData.title,
        ticket_type: ticketData.ticketType,
        ticket_description: ticketData.ticketDescription,
        description: ticketData.description,
        reported_issue: ticketData.reportedIssue,
        confirmed_issue: ticketData.confirmedIssue,
        service_performed: ticketData.servicePerformed,
        status: ticketData.status,
        priority: ticketData.priority,
        category: ticketData.category,
        created_by: userId,
        client_id: ticketData.clientId,
        under_warranty: ticketData.underWarranty,
        is_working: ticketData.isWorking,
        service_completed: ticketData.serviceCompleted,
        client_verified: ticketData.clientVerified
      }])
      .select('*')
      .single();
    
    if (error) {
      console.error("Supabase error details:", error);
      throw error;
    }

    // Convert the response to our Ticket format
    const newTicket: Ticket = {
      id: data.id,
      title: data.title,
      ticketType: data.ticket_type as TicketType || TicketType.PREVENTIVE_MAINTENANCE,
      ticketDescription: data.ticket_description as TicketDescriptionType || TicketDescriptionType.MECHANICAL_LOCK,
      description: data.description,
      reportedIssue: data.reported_issue,
      confirmedIssue: data.confirmed_issue,
      servicePerformed: data.service_performed,
      status: data.status as TicketStatus,
      priority: data.priority as TicketPriority,
      category: data.category as TicketCategory,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      createdBy: data.created_by || userId,
      assignedTo: data.assigned_to,
      clientId: data.client_id,
      underWarranty: data.under_warranty,
      isWorking: data.is_working,
      serviceCompleted: data.service_completed,
      clientVerified: data.client_verified,
      comments: []
    };

    return newTicket;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
}

export async function updateTicketById(
  id: string,
  updates: Partial<Ticket>
): Promise<void> {
  try {
    // Prepare data for update
    const updateData: any = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.status) updateData.status = updates.status;
    if (updates.priority) updateData.priority = updates.priority;
    if (updates.category) updateData.category = updates.category;
    if (updates.assignedTo) updateData.assigned_to = updates.assignedTo;
    if (updates.reportedIssue) updateData.reported_issue = updates.reportedIssue;
    if (updates.confirmedIssue) updateData.confirmed_issue = updates.confirmedIssue;
    if (updates.servicePerformed) updateData.service_performed = updates.servicePerformed;
    if (updates.ticketType) updateData.ticket_type = updates.ticketType;
    if (updates.ticketDescription) updateData.ticket_description = updates.ticketDescription;
    if (updates.underWarranty !== undefined) updateData.under_warranty = updates.underWarranty;
    if (updates.isWorking !== undefined) updateData.is_working = updates.isWorking;
    if (updates.serviceCompleted !== undefined) updateData.service_completed = updates.serviceCompleted;
    if (updates.clientVerified !== undefined) updateData.client_verified = updates.clientVerified;
    
    // Update in Supabase
    const { error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
}

export async function addTicketComment(
  ticketId: string,
  content: string,
  userId: string,
  attachments?: string[]
): Promise<TicketComment> {
  try {
    // Insert comment in Supabase
    const { data, error } = await supabase
      .from('ticket_comments')
      .insert([{
        ticket_id: ticketId,
        content,
        created_by: userId,
        attachments: attachments || null
      }])
      .select('*')
      .single();
    
    if (error) {
      throw error;
    }

    // Create new comment for the state
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

    return newComment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}
