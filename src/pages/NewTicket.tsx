
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/contexts/TicketContext";
import { useAuth } from "@/contexts/AuthContext";
import { useClients } from "@/contexts/ClientContext";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Search, Plus, Check, Building, MapPin, City } from "lucide-react";
import { cn } from "@/lib/utils";

const NewTicket = () => {
  const navigate = useNavigate();
  const { addTicket } = useTickets();
  const { user } = useAuth();
  const { clients } = useClients(); 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [category, setCategory] = useState<TicketCategory>(TicketCategory.SOFTWARE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para o cliente selecionado
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [open, setOpen] = useState(false);

  // Encontrar o cliente selecionado para mostrar suas informações
  const selectedClientInfo = clients.find(client => client.id === selectedClient);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !selectedClient) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      await addTicket({
        title,
        description,
        status: TicketStatus.OPEN,
        priority,
        category,
        createdBy: user.id,
        clientId: selectedClient,
      });

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
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between min-w-[240px]"
              >
                {selectedClient
                  ? clients.find((client) => client.id === selectedClient)?.name
                  : "Buscar cliente..."}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0">
              <Command>
                <CommandInput placeholder="Buscar cliente..." />
                <CommandList>
                  <CommandEmpty>
                    <div className="flex flex-col items-center p-2">
                      <p className="text-sm">Nenhum cliente encontrado</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => navigate("/clients/new")}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Cliente
                      </Button>
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {clients.map((client) => (
                      <CommandItem
                        key={client.id}
                        value={client.name}
                        onSelect={() => {
                          setSelectedClient(client.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedClient === client.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{client.name}</span>
                          <span className="text-xs text-muted-foreground">{client.unit}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button onClick={() => navigate("/clients/new")}>
            <Plus size={16} className="mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Informações do cliente selecionado */}
      {selectedClientInfo && (
        <Card className="max-w-2xl mx-auto bg-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <Building className="h-4 w-4 mr-2 opacity-70" />
                  <Label className="font-medium">Nome do Cliente:</Label>
                </div>
                <p className="text-sm ml-6">{selectedClientInfo.name}</p>
                
                <div className="flex items-center mb-2 mt-4">
                  <Building className="h-4 w-4 mr-2 opacity-70" />
                  <Label className="font-medium">Unidade:</Label>
                </div>
                <p className="text-sm ml-6">{selectedClientInfo.unit}</p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 mr-2 opacity-70" />
                  <Label className="font-medium">Endereço:</Label>
                </div>
                <p className="text-sm ml-6">{selectedClientInfo.address}</p>
                
                <div className="flex items-center mb-2 mt-4">
                  <City className="h-4 w-4 mr-2 opacity-70" />
                  <Label className="font-medium">Cidade/Estado:</Label>
                </div>
                <p className="text-sm ml-6">{selectedClientInfo.city} - {selectedClientInfo.state}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            <Button type="submit" disabled={isSubmitting || !selectedClient}>
              {isSubmitting ? "Enviando..." : "Abrir Chamado"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewTicket;
