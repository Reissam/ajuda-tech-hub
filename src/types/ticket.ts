
export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved"
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

export enum TicketCategory {
  HARDWARE = "hardware",
  SOFTWARE = "software",
  NETWORK = "network",
  OTHER = "other"
}

export interface TicketComment {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  attachments?: string[];
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  comments: TicketComment[];
  attachments?: string[];
}
