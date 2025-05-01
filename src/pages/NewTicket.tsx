
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/contexts/ticket";
import { useAuth } from "@/contexts/AuthContext";
import { TicketPriority, TicketStatus, TicketCategory, TicketType, TicketDescriptionType } from "@/types/ticket";
import { toast } from "sonner";
import { ClientSearchComponent } from "@/components/tickets/ClientSearchComponent";
import { ClientInfoCard } from "@/components/tickets/ClientInfoCard";
import { TicketDetailsForm } from "@/components/tickets/TicketDetailsForm";
import { useClients } from "@/contexts/ClientContext";
import { UserRole } from "@/types/user";

const NewTicket = () => {
  const navigate = useNavigate();
  const { addTicket } = useTickets();
  const { user } = useAuth();
  const { clients } = useClients();
  
  // Form state
  const [ticketType, setTicketType] = useState<TicketType>(TicketType.PREVENTIVE_MAINTENANCE);
  const [ticketDescription, setTicketDescription] = useState<TicketDescriptionType>(TicketDescriptionType.MECHANICAL_LOCK);
  const [description, setDescription] = useState("");
  const [reportedIssue, setReportedIssue] = useState("");
  const [confirmedIssue, setConfirmedIssue] = useState("");
  const [servicePerformed, setServicePerformed] = useState("");
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [category, setCategory] = useState<TicketCategory>(TicketCategory.SOFTWARE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [underWarranty, setUnderWarranty] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [serviceCompleted, setServiceCompleted] = useState(false);
  const [clientVerified, setClientVerified] = useState(false);
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [serviceDate, setServiceDate] = useState<Date | undefined>(undefined);

  // Encontrar o cliente selecionado para mostrar suas informações
  const selectedClientInfo = clients.find(client => client.id === selectedClient);
  
  // Verificar se o usuário é gestor ou administrador
  const isManagerOrAdmin = user?.role === UserRole.MANAGER || user?.role === UserRole.ADMIN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação diferente para gestores/admins - apenas "reportedIssue" obrigatório
    if (isManagerOrAdmin) {
      if (!reportedIssue || !selectedClient) {
        toast.error("Por favor, preencha o cliente e o defeito informado");
        return;
      }
    } else {
      // Para outros usuários, mantém a validação original
      if (!description || !selectedClient || !reportedIssue) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      await addTicket({
        ticketType,
        ticketDescription,
        // Para gestores/admins, se description estiver vazio, use reportedIssue
        description: isManagerOrAdmin && !description.trim() ? reportedIssue : description,
        reportedIssue,
        confirmedIssue,
        servicePerformed,
        status: TicketStatus.OPEN,
        priority,
        category,
        createdBy: user.id,
        clientId: selectedClient,
        underWarranty,
        isWorking,
        serviceCompleted,
        clientVerified,
        arrivalTime,
        departureTime,
        serviceDate
      });

      toast.success("Chamado aberto com sucesso!");
      navigate("/tickets");
    } catch (error) {
      console.error("Erro ao abrir chamado:", error);
      toast.error("Erro ao abrir chamado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Novo Chamado</h1>
        <ClientSearchComponent 
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
        />
      </div>

      {/* Informações do cliente selecionado */}
      {selectedClientInfo && (
        <ClientInfoCard client={selectedClientInfo} />
      )}

      <TicketDetailsForm
        ticketType={ticketType}
        setTicketType={setTicketType}
        ticketDescription={ticketDescription}
        setTicketDescription={setTicketDescription}
        description={description}
        setDescription={setDescription}
        reportedIssue={reportedIssue}
        setReportedIssue={setReportedIssue}
        confirmedIssue={confirmedIssue}
        setConfirmedIssue={setConfirmedIssue}
        servicePerformed={servicePerformed}
        setServicePerformed={setServicePerformed}
        priority={priority}
        setPriority={setPriority}
        category={category}
        setCategory={setCategory}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        handleCancel={() => navigate("/tickets")}
        hasSelectedClient={!!selectedClient}
        underWarranty={underWarranty}
        setUnderWarranty={setUnderWarranty}
        isWorking={isWorking}
        setIsWorking={setIsWorking}
        serviceCompleted={serviceCompleted}
        setServiceCompleted={setServiceCompleted}
        clientVerified={clientVerified}
        setClientVerified={setClientVerified}
        arrivalTime={arrivalTime}
        setArrivalTime={setArrivalTime}
        departureTime={departureTime}
        setDepartureTime={setDepartureTime}
        serviceDate={serviceDate}
        setServiceDate={setServiceDate}
        isManagerOrAdmin={isManagerOrAdmin}
      />
    </div>
  );
};

export default NewTicket;
