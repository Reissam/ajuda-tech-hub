
import { useState } from "react";
import { TicketPriority, TicketStatus, TicketCategory, TicketType } from "@/types/ticket";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface TicketFormProps {
  ticketType: TicketType;
  setTicketType: (ticketType: TicketType) => void;
  description: string;
  setDescription: (description: string) => void;
  priority: TicketPriority;
  setPriority: (priority: TicketPriority) => void;
  category: TicketCategory;
  setCategory: (category: TicketCategory) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  hasSelectedClient: boolean;
}

export const TicketDetailsForm = ({
  ticketType,
  setTicketType,
  description,
  setDescription,
  priority,
  setPriority,
  category,
  setCategory,
  isSubmitting,
  handleSubmit,
  handleCancel,
  hasSelectedClient
}: TicketFormProps) => {
  return (
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
            <Label htmlFor="ticketType">Tipo de Chamado</Label>
            <Select
              value={ticketType}
              onValueChange={(value) => setTicketType(value as TicketType)}
            >
              <SelectTrigger id="ticketType">
                <SelectValue placeholder="Selecione o tipo de chamado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TicketType.PREVENTIVE_MAINTENANCE}>Manutenção preventiva</SelectItem>
                <SelectItem value={TicketType.CORRECTIVE_MAINTENANCE}>Manutenção corretiva</SelectItem>
                <SelectItem value={TicketType.INSTALLATION}>Instalação</SelectItem>
                <SelectItem value={TicketType.CORRECTIVE_AND_PREVENTIVE}>Manutenção Corretiva e preventiva</SelectItem>
              </SelectContent>
            </Select>
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
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || !hasSelectedClient}>
            {isSubmitting ? "Enviando..." : "Abrir Chamado"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
