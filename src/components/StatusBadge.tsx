
import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@/types/ticket";

interface StatusBadgeProps {
  status: TicketStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return { label: "Aberto", variant: "destructive" as const };
      case TicketStatus.IN_PROGRESS:
        return { label: "Em Andamento", variant: "default" as const, className: "bg-warning" };
      case TicketStatus.RESOLVED:
        return { label: "Resolvido", variant: "default" as const, className: "bg-success" };
      default:
        return { label: "Desconhecido", variant: "outline" as const };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};
