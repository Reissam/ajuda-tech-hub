
import { useAuth } from "@/contexts/AuthContext";
import { useTickets } from "@/contexts/ticket"; 
import { UserRole } from "@/types/user";
import { TicketStatus, TicketPriority } from "@/types/ticket";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart, 
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import TechnicianOpenTickets from "@/components/tickets/TechnicianOpenTickets";

const Dashboard = () => {
  const { user } = useAuth();
  const { tickets } = useTickets();

  // Dados para o dashboard do cliente
  const clientTicketsByStatus = [
    {
      name: "Abertos",
      value: tickets.filter((t) => t.status === TicketStatus.OPEN && t.createdBy === user?.id)
        .length,
      color: "#ef4444",
    },
    {
      name: "Em Andamento",
      value: tickets.filter(
        (t) => t.status === TicketStatus.IN_PROGRESS && t.createdBy === user?.id
      ).length,
      color: "#f59e0b",
    },
    {
      name: "Resolvidos",
      value: tickets.filter(
        (t) => t.status === TicketStatus.RESOLVED && t.createdBy === user?.id
      ).length,
      color: "#10b981",
    },
  ];

  // Dados para o dashboard do técnico
  const technicianTicketsByPriority = [
    {
      name: "Alta",
      valor: tickets.filter(
        (t) => t.priority === TicketPriority.HIGH && t.assignedTo === user?.id
      ).length,
    },
    {
      name: "Média",
      valor: tickets.filter(
        (t) => t.priority === TicketPriority.MEDIUM && t.assignedTo === user?.id
      ).length,
    },
    {
      name: "Baixa",
      valor: tickets.filter(
        (t) => t.priority === TicketPriority.LOW && t.assignedTo === user?.id
      ).length,
    },
  ];

  // Dados para o dashboard do administrador
  const ticketsByStatusAdmin = [
    {
      name: "Abertos",
      valor: tickets.filter((t) => t.status === TicketStatus.OPEN).length,
    },
    {
      name: "Em Andamento",
      valor: tickets.filter((t) => t.status === TicketStatus.IN_PROGRESS).length,
    },
    {
      name: "Resolvidos",
      valor: tickets.filter((t) => t.status === TicketStatus.RESOLVED).length,
    },
  ];

  // Dados de tendência de chamados por dia (simulado)
  const ticketsTrend = [
    { date: "Seg", count: 5 },
    { date: "Ter", count: 8 },
    { date: "Qua", count: 12 },
    { date: "Qui", count: 6 },
    { date: "Sex", count: 9 },
    { date: "Sáb", count: 3 },
    { date: "Dom", count: 1 },
  ];

  // Configuração dos gráficos
  const chartConfig = {
    open: {
      label: "Abertos",
      color: "#ef4444",
    },
    inProgress: {
      label: "Em Andamento",
      color: "#f59e0b",
    },
    resolved: {
      label: "Resolvidos",
      color: "#10b981",
    },
    high: {
      label: "Alta",
      color: "#ef4444",
    },
    medium: {
      label: "Média",
      color: "#f59e0b",
    },
    low: {
      label: "Baixa",
      color: "#22c55e",
    },
    trend: {
      label: "Tendência",
      color: "#3b82f6",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Resumo de Chamados */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Chamados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.role === UserRole.CLIENT
                ? tickets.filter((t) => t.createdBy === user.id).length
                : user?.role === UserRole.TECHNICIAN
                ? tickets.filter((t) => t.assignedTo === user.id).length
                : tickets.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.role === UserRole.CLIENT
                ? "Chamados abertos por você"
                : user?.role === UserRole.TECHNICIAN
                ? "Chamados atribuídos a você"
                : "Chamados no sistema"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.role === UserRole.CLIENT
                ? tickets.filter(
                    (t) => t.status === TicketStatus.IN_PROGRESS && t.createdBy === user.id
                  ).length
                : user?.role === UserRole.TECHNICIAN
                ? tickets.filter(
                    (t) => t.status === TicketStatus.IN_PROGRESS && t.assignedTo === user.id
                  ).length
                : tickets.filter((t) => t.status === TicketStatus.IN_PROGRESS).length}
            </div>
            <p className="text-xs text-muted-foreground">Chamados em progresso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.role === UserRole.CLIENT
                ? tickets.filter(
                    (t) => t.status === TicketStatus.RESOLVED && t.createdBy === user.id
                  ).length
                : user?.role === UserRole.TECHNICIAN
                ? tickets.filter(
                    (t) => t.status === TicketStatus.RESOLVED && t.assignedTo === user.id
                  ).length
                : tickets.filter((t) => t.status === TicketStatus.RESOLVED).length}
            </div>
            <p className="text-xs text-muted-foreground">Chamados resolvidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Mostrar lista de chamados abertos para técnicos */}
      {user?.role === UserRole.TECHNICIAN && user?.id && (
        <TechnicianOpenTickets userId={user.id} />
      )}

      {/* Gráficos específicos por perfil */}
      {user?.role === UserRole.CLIENT && (
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Status dos Seus Chamados</CardTitle>
            <CardDescription>Distribuição dos seus chamados por status</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80 w-full">
              <ChartContainer config={chartConfig} className="h-80">
                <PieChart>
                  <Pie
                    data={clientTicketsByStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label
                  >
                    {clientTicketsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                  <Legend />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.role === UserRole.TECHNICIAN && (
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Chamados por Prioridade</CardTitle>
            <CardDescription>Distribuição dos chamados atribuídos a você por prioridade</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80 w-full">
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={technicianTicketsByPriority}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                  <Legend />
                  <Bar dataKey="valor" fill="#3b82f6" name="Quantidade" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.role === UserRole.ADMIN && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Chamados por Status</CardTitle>
                <CardDescription>Distribuição geral dos chamados</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-80 w-full">
                  <ChartContainer config={chartConfig} className="h-80">
                    <BarChart data={ticketsByStatusAdmin}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip 
                        content={<ChartTooltipContent />} 
                      />
                      <Legend />
                      <Bar dataKey="valor" fill="#3b82f6" name="Quantidade" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendência de Chamados</CardTitle>
                <CardDescription>Novos chamados por dia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ChartContainer config={chartConfig} className="h-80">
                    <LineChart data={ticketsTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip 
                        content={<ChartTooltipContent />} 
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        name="Chamados"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
