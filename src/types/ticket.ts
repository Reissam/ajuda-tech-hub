
export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TicketCategory {
  HARDWARE = 'hardware',
  SOFTWARE = 'software',
  NETWORK = 'network',
  OTHER = 'other',
}

export enum TicketType {
  PREVENTIVE_MAINTENANCE = 'preventive_maintenance',
  CORRECTIVE_MAINTENANCE = 'corrective_maintenance',
  INSTALLATION = 'installation',
  CORRECTIVE_AND_PREVENTIVE = 'corrective_and_preventive',
}

export enum TicketDescriptionType {
  MECHANICAL_LOCK = 'mechanical_lock',
  ELECTROMAGNETIC_LOCK = 'electromagnetic_lock',
  DELAY_LOCK = 'delay_lock',
  ACCESS_LOCK = 'access_lock',
  BIOMETRIC_LOCK = 'biometric_lock',
  SAFE = 'safe',
  FOG_GENERATOR = 'fog_generator',
  PSDM = 'psdm',
  DVR = 'dvr',
  NVR = 'nvr',
  CAMERA = 'camera',
  ALARM = 'alarm',
}

export interface Ticket {
  id: string;
  title?: string;
  ticketType: TicketType;
  ticketDescription: TicketDescriptionType;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo?: string;
  clientId: string;
  comments?: TicketComment[];
}

export interface TicketComment {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  attachments?: string[];
}
