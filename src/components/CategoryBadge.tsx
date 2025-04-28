
import { Badge } from "@/components/ui/badge";
import { TicketCategory } from "@/types/ticket";

interface CategoryBadgeProps {
  category: TicketCategory;
}

export const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const getCategoryConfig = (category: TicketCategory) => {
    switch (category) {
      case TicketCategory.HARDWARE:
        return { label: "Hardware", className: "bg-blue-500" };
      case TicketCategory.SOFTWARE:
        return { label: "Software", className: "bg-purple-500" };
      case TicketCategory.NETWORK:
        return { label: "Rede", className: "bg-green-500" };
      case TicketCategory.OTHER:
        return { label: "Outro", className: "bg-gray-500" };
      default:
        return { label: "Desconhecido", className: "" };
    }
  };

  const config = getCategoryConfig(category);

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};
