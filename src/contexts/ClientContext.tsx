
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Client } from "@/types/client";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, "id">) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  getClientById: (id: string) => Client | undefined;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar clientes do Supabase quando o componente for montado
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('clients')
          .select('*');
        
        if (error) {
          throw error;
        }

        // Transformar os dados para o formato esperado pela aplicação
        const clientsData: Client[] = data ? data.map(client => ({
          id: client.id,
          name: client.name,
          unit: client.unit,
          address: client.address,
          city: client.city,
          state: client.state
        })) : [];

        setClients(clientsData);
        console.log("Clientes carregados:", clientsData);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        toast.error('Erro ao carregar clientes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const addClient = async (clientData: Omit<Client, "id">) => {
    try {
      console.log("Enviando dados do cliente para o Supabase:", clientData);
      
      // Verificar se todos os campos necessários estão presentes
      if (!clientData.name || !clientData.unit || !clientData.address || !clientData.city || !clientData.state) {
        throw new Error("Todos os campos são obrigatórios");
      }

      // Criar objeto para inserção no formato esperado pelo Supabase
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: clientData.name,
          unit: clientData.unit,
          address: clientData.address,
          city: clientData.city,
          state: clientData.state
        })
        .select('*')
        .single();
      
      if (error) {
        console.error("Erro detalhado do Supabase:", error);
        throw error;
      }

      console.log("Cliente cadastrado com sucesso:", data);

      const newClient: Client = {
        id: data.id,
        name: data.name,
        unit: data.unit,
        address: data.address,
        city: data.city,
        state: data.state
      };

      setClients(prev => [...prev, newClient]);
      toast.success("Cliente cadastrado com sucesso!");
      return Promise.resolve();
    } catch (error: any) {
      console.error('Erro ao cadastrar cliente:', error);
      toast.error(`Erro ao cadastrar cliente: ${error.message || error}`);
      throw error;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id);
      
      if (error) {
        throw error;
      }

      setClients(prev =>
        prev.map(client =>
          client.id === id
            ? { ...client, ...updates }
            : client
        )
      );
      toast.success("Cliente atualizado com sucesso!");
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast.error('Erro ao atualizar cliente');
      throw error;
    }
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
