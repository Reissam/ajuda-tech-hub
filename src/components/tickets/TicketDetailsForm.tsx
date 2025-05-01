
import { useState } from "react";
import { TicketPriority, TicketStatus, TicketCategory, TicketType, TicketDescriptionType } from "@/types/ticket";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketFormProps {
  ticketType: TicketType;
  setTicketType: (ticketType: TicketType) => void;
  ticketDescription: TicketDescriptionType;
  setTicketDescription: (ticketDescription: TicketDescriptionType) => void;
  description: string;
  setDescription: (description: string) => void;
  reportedIssue: string;
  setReportedIssue: (reportedIssue: string) => void;
  confirmedIssue: string;
  setConfirmedIssue: (confirmedIssue: string) => void;
  servicePerformed: string;
  setServicePerformed: (servicePerformed: string) => void;
  priority: TicketPriority;
  setPriority: (priority: TicketPriority) => void;
  category: TicketCategory;
  setCategory: (category: TicketCategory) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  hasSelectedClient: boolean;
  underWarranty: boolean;
  setUnderWarranty: (underWarranty: boolean) => void;
  isWorking: boolean;
  setIsWorking: (isWorking: boolean) => void;
  serviceCompleted: boolean;
  setServiceCompleted: (serviceCompleted: boolean) => void;
  clientVerified: boolean;
  setClientVerified: (clientVerified: boolean) => void;
  arrivalTime: string;
  setArrivalTime: (time: string) => void;
  departureTime: string;
  setDepartureTime: (time: string) => void;
  serviceDate: Date | undefined;
  setServiceDate: (date: Date | undefined) => void;
  isManagerOrAdmin?: boolean;
}

export const TicketDetailsForm = ({
  ticketType,
  setTicketType,
  ticketDescription,
  setTicketDescription,
  description,
  setDescription,
  reportedIssue,
  setReportedIssue,
  confirmedIssue,
  setConfirmedIssue,
  servicePerformed,
  setServicePerformed,
  priority,
  setPriority,
  category,
  setCategory,
  isSubmitting,
  handleSubmit,
  handleCancel,
  hasSelectedClient,
  underWarranty,
  setUnderWarranty,
  isWorking,
  setIsWorking,
  serviceCompleted,
  setServiceCompleted,
  clientVerified,
  setClientVerified,
  arrivalTime,
  setArrivalTime,
  departureTime,
  setDepartureTime,
  serviceDate,
  setServiceDate,
  isManagerOrAdmin = false
}: TicketFormProps) => {
  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Detalhes do Chamado</CardTitle>
          <CardDescription>
            Preencha as informações para abrir um novo chamado de suporte técnico.
            {isManagerOrAdmin && (
              <span className="block mt-1 text-blue-500">
                Apenas o campo "Defeito Informado" é obrigatório para gestores e administradores.
              </span>
            )}
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
            <Label htmlFor="ticketDescription">Descrição de Chamado</Label>
            <Select
              value={ticketDescription}
              onValueChange={(value) => setTicketDescription(value as TicketDescriptionType)}
            >
              <SelectTrigger id="ticketDescription">
                <SelectValue placeholder="Selecione a descrição do chamado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TicketDescriptionType.MECHANICAL_LOCK}>Fechadura mecânica</SelectItem>
                <SelectItem value={TicketDescriptionType.ELECTROMAGNETIC_LOCK}>Fechadura eletromagnética</SelectItem>
                <SelectItem value={TicketDescriptionType.DELAY_LOCK}>Fechadura de retardo</SelectItem>
                <SelectItem value={TicketDescriptionType.ACCESS_LOCK}>Fechadura de acesso</SelectItem>
                <SelectItem value={TicketDescriptionType.BIOMETRIC_LOCK}>Fechadura de biometria</SelectItem>
                <SelectItem value={TicketDescriptionType.SAFE}>Cofre</SelectItem>
                <SelectItem value={TicketDescriptionType.FOG_GENERATOR}>Gerador de Neblina</SelectItem>
                <SelectItem value={TicketDescriptionType.PSDM}>PSDM</SelectItem>
                <SelectItem value={TicketDescriptionType.DVR}>DVR</SelectItem>
                <SelectItem value={TicketDescriptionType.NVR}>NVR</SelectItem>
                <SelectItem value={TicketDescriptionType.CAMERA}>Câmera</SelectItem>
                <SelectItem value={TicketDescriptionType.ALARM}>Alarme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportedIssue" className="flex items-center">
              Defeito Informado
              {isManagerOrAdmin && <span className="ml-1 text-red-500">*</span>}
            </Label>
            <Textarea
              id="reportedIssue"
              placeholder="Descreva o defeito informado pelo cliente"
              rows={3}
              value={reportedIssue}
              onChange={(e) => setReportedIssue(e.target.value)}
              required={true}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmedIssue">Defeito Constatado</Label>
            <Textarea
              id="confirmedIssue"
              placeholder="Descreva o defeito constatado após análise"
              rows={3}
              value={confirmedIssue}
              onChange={(e) => setConfirmedIssue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="servicePerformed">Serviço Executado</Label>
            <Textarea
              id="servicePerformed"
              placeholder="Descreva o serviço que foi executado"
              rows={3}
              value={servicePerformed}
              onChange={(e) => setServicePerformed(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className={isManagerOrAdmin ? "" : "flex items-center"}>
              Observações
              {!isManagerOrAdmin && <span className="ml-1 text-red-500">*</span>}
            </Label>
            <Textarea
              id="description"
              placeholder="Observações adicionais sobre o chamado"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required={!isManagerOrAdmin}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="warranty">Em garantia</Label>
              <RadioGroup 
                id="warranty" 
                value={underWarranty ? "yes" : "no"}
                onValueChange={(value) => setUnderWarranty(value === "yes")}
                className="flex items-center gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="warranty-yes" />
                  <Label htmlFor="warranty-yes" className="cursor-pointer">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="warranty-no" />
                  <Label htmlFor="warranty-no" className="cursor-pointer">Não</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="working">Em funcionamento</Label>
              <RadioGroup 
                id="working" 
                value={isWorking ? "yes" : "no"}
                onValueChange={(value) => setIsWorking(value === "yes")}
                className="flex items-center gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="working-yes" />
                  <Label htmlFor="working-yes" className="cursor-pointer">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="working-no" />
                  <Label htmlFor="working-no" className="cursor-pointer">Não</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="completed">Serviço concluído</Label>
              <RadioGroup 
                id="completed" 
                value={serviceCompleted ? "yes" : "no"}
                onValueChange={(value) => setServiceCompleted(value === "yes")}
                className="flex items-center gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="completed-yes" />
                  <Label htmlFor="completed-yes" className="cursor-pointer">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="completed-no" />
                  <Label htmlFor="completed-no" className="cursor-pointer">Não</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verified">Verificado pelo Cliente</Label>
              <RadioGroup 
                id="verified" 
                value={clientVerified ? "yes" : "no"}
                onValueChange={(value) => setClientVerified(value === "yes")}
                className="flex items-center gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="verified-yes" />
                  <Label htmlFor="verified-yes" className="cursor-pointer">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="verified-no" />
                  <Label htmlFor="verified-no" className="cursor-pointer">Não</Label>
                </div>
              </RadioGroup>
            </div>
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
          
          {/* New fields for service time and date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="arrivalTime">Horário de Chegada</Label>
              <Input
                id="arrivalTime"
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departureTime">Horário de Saída</Label>
              <Input
                id="departureTime"
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceDate">Data do Atendimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !serviceDate && "text-muted-foreground"
                  )}
                  id="serviceDate"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {serviceDate ? format(serviceDate, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={serviceDate}
                  onSelect={setServiceDate}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
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
