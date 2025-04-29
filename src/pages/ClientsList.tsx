
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

// Mock data de clientes para simulação
const mockClients = [
  { id: "1", name: "Empresa ABC Ltda.", unit: "Matriz", address: "Av. Paulista, 1000", city: "São Paulo", state: "SP" },
  { id: "2", name: "Supermercado XYZ", unit: "Filial 1", address: "Rua das Flores, 123", city: "Rio de Janeiro", state: "RJ" },
  { id: "3", name: "Tech Solutions", unit: "Sede", address: "Av. Tecnologia, 456", city: "Belo Horizonte", state: "MG" },
  { id: "4", name: "Distribuidora FastDelivery", unit: "Centro", address: "Rua da Entrega, 789", city: "Curitiba", state: "PR" },
  { id: "5", name: "Consultoria Inovação", unit: "Unidade Principal", address: "Av. Consultores, 321", city: "Brasília", state: "DF" },
];

const ClientsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Verificação se o usuário tem permissão para acessar essa página
  if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.MANAGER) {
    // Se não for admin ou gestor, redireciona para o dashboard
    navigate("/dashboard");
    return null;
  }

  // Filtrar clientes com base na busca
  const filteredClients = mockClients.filter((client) => {
    // Filtro por busca (nome ou ID)
    if (
      searchQuery &&
      !client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !client.id.includes(searchQuery)
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
        <Button onClick={() => navigate("/clients/new")}>
          <Plus size={16} className="mr-2" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Gerenciamento de clientes cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID ou nome..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Unidade</TableHead>
                  <TableHead className="hidden md:table-cell">Cidade</TableHead>
                  <TableHead className="hidden md:table-cell">Estado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">#{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{client.unit}</TableCell>
                      <TableCell className="hidden md:table-cell">{client.city}</TableCell>
                      <TableCell className="hidden md:table-cell">{client.state}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Futuramente: navegar para detalhes do cliente
                            console.log(`Ver detalhes do cliente ${client.id}`);
                          }}
                        >
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsList;
