
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "@/contexts/ClientContext";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { Search, Plus, Check } from "lucide-react";

interface ClientSearchComponentProps {
  selectedClient: string;
  setSelectedClient: (id: string) => void;
}

export const ClientSearchComponent = ({ 
  selectedClient, 
  setSelectedClient 
}: ClientSearchComponentProps) => {
  const navigate = useNavigate();
  const { clients } = useClients();
  const [open, setOpen] = useState(false);

  return (
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
  );
};
