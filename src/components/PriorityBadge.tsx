
import { Badge } from "@/components/ui/badge";
import { TicketPriority } from "@/types/ticket";

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const getPriorityConfig = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW:
        return { label: "Baixa", variant: "outline" as const };
      case TicketPriority.MEDIUM:
        return { label: "Média", variant: "default" as const, className: "bg-warning" };
      case TicketPriority.HIGH:
        return { label: "Alta", variant: "destructive" as const };
      default:
        return { label: "Desconhecido", variant: "outline" as const };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};
