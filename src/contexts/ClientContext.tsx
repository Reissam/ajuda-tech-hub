
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Client } from "@/types/client";
import { toast } from "sonner";

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  getClientById: (id: string) => Client | undefined;
}

// Mock data para clientes
const MOCK_CLIENTS: Client[] = [
  { id: "1", name: "Empresa ABC Ltda.", unit: "Matriz", address: "Av. Paulista, 1000", city: "São Paulo", state: "SP" },
  { id: "2", name: "Supermercado XYZ", unit: "Filial 1", address: "Rua das Flores, 123", city: "Rio de Janeiro", state: "RJ" },
  { id: "3", name: "Tech Solutions", unit: "Sede", address: "Av. Tecnologia, 456", city: "Belo Horizonte", state: "MG" },
  { id: "4", name: "Distribuidora FastDelivery", unit: "Centro", address: "Rua da Entrega, 789", city: "Curitiba", state: "PR" },
  { id: "5", name: "Consultoria Inovação", unit: "Unidade Principal", address: "Av. Consultores, 321", city: "Brasília", state: "DF" },
];

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);

  const addClient = (clientData: Omit<Client, "id">) => {
    const newClient: Client = {
      ...clientData,
      id: `${clients.length + 1}`
    };

    setClients(prev => [...prev, newClient]);
    toast.success("Cliente cadastrado com sucesso!");
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev =>
      prev.map(client =>
        client.id === id
          ? { ...client, ...updates }
          : client
      )
    );
    toast.success("Cliente atualizado com sucesso!");
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        getClientById
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClients must be used within a ClientProvider");
  }
  return context;
};
