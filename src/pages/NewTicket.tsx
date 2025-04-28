
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/contexts/TicketContext";
import { useAuth } from "@/contexts/AuthContext";
import { TicketPriority, TicketStatus, TicketCategory } from "@/types/ticket";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const NewTicket = () => {
  const navigate = useNavigate();
  const { addTicket } = useTickets();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [category, setCategory] = useState<TicketCategory>(TicketCategory.SOFTWARE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      addTicket({
        title,
        description,
        status: TicketStatus.OPEN,
        priority,
        category,
        createdBy: user.id,
      });

      toast.success("Chamado aberto com sucesso!");
      navigate("/tickets");
    } catch (error) {
      toast.error("Erro ao abrir chamado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Novo Chamado</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Detalhes do Chamado</CardTitle>
            <CardDescription>
              Preencha as informações para abrir um novo chamado de suporte técnico.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Descreva brevemente o problema"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva detalhadamente o problema que você está enfrentando"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as TicketCategory)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TicketCategory.HARDWARE}>Hardware</SelectItem>
                    <SelectItem value={TicketCategory.SOFTWARE}>Software</SelectItem>
                    <SelectItem value={TicketCategory.NETWORK}>Rede</SelectItem>
                    <SelectItem value={TicketCategory.OTHER}>Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as TicketPriority)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TicketPriority.LOW}>Baixa</SelectItem>
                    <SelectItem value={TicketPriority.MEDIUM}>Média</SelectItem>
                    <SelectItem value={TicketPriority.HIGH}>Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Anexos (mock) */}
            <div className="space-y-2">
              <Label htmlFor="attachments">Anexos (opcional)</Label>
              <Input id="attachments" type="file" className="cursor-pointer" disabled />
              <p className="text-sm text-muted-foreground">
                Você pode anexar capturas de tela ou documentos relevantes (max 5MB por arquivo).
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/tickets")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Abrir Chamado"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewTicket;
