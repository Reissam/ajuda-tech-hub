
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
  const [title, setTitle] = useState("");
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
    
    // Validação incluindo título
    if (isManagerOrAdmin) {
      if (!title || !reportedIssue || !selectedClient) {
        toast.error("Por favor, preencha o título, o cliente e o defeito informado");
        return;
      }
    } else {
      // Para outros usuários, mantém a validação original e adiciona título
      if (!title || !description || !selectedClient || !reportedIssue) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const ticketData = {
        title,
        ticketType,
        ticketDescription,
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
      };

      await addTicket(ticketData);

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

      {/* Campo de título adicionado */}
      <div className="mb-4">
        <label htmlFor="title" className="block font-medium text-sm mb-1">Título do Chamado</label>
        <input
          type="text"
          id="title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Insira um título para o chamado"
          required
        />
      </div>

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
