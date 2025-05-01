
import { TicketStatus, TicketPriority, TicketCategory, TicketType, TicketDescriptionType } from "@/types/ticket";

export interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "comments">) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  getTicketById: (id: string) => Ticket | undefined;
  assignTicket: (ticketId: string, technicianId: string) => Promise<void>;
  addComment: (ticketId: string, content: string, attachments?: string[]) => Promise<void>;
}

export interface Ticket {
  id: string;
  title?: string;
  ticketType: TicketType;
  ticketDescription: TicketDescriptionType;
  description: string;
  reportedIssue?: string;
  confirmedIssue?: string;
  servicePerformed?: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo?: string;
  clientId: string;
  comments?: TicketComment[];
  underWarranty?: boolean;
  isWorking?: boolean;
  serviceCompleted?: boolean;
  clientVerified?: boolean;
  arrivalTime?: string;
  departureTime?: string;
  serviceDate?: Date;
}

export interface TicketComment {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  attachments?: string[];
}
