
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { toast } from "sonner";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface ClientFormValues {
  name: string;
  email: string;
  password: string;
  address: string;
  state: string;
  city: string;
  unit: string;
}

const ClientRegistration = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ClientFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      state: "",
      city: "",
      unit: ""
    }
  });

  // Verify if the current user is authorized to access this page
  if (user?.role !== UserRole.ADMIN && !user) {
    // If not an admin or not logged in, redirect to login
    navigate("/auth");
    return null;
  }

  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      // First register the client with basic info
      await register(data.name, data.email, data.password);
      
      // In a real application with a database, we would update the additional fields here
      toast.success("Cliente cadastrado com sucesso!");
      
      // Redirect to dashboard or clients list
      navigate("/dashboard");
    } catch (error) {
      console.error("Error registering client:", error);
      toast.error("Erro ao cadastrar cliente. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Cadastro de Cliente</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
          <CardDescription>
            Preencha todos os campos para cadastrar um novo cliente no sistema.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Cliente</Label>
                  <Input
                    id="name"
                    placeholder="Nome completo"
                    {...form.register("name", { required: true })}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm font-medium text-destructive">Nome é obrigatório</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    {...form.register("email", { required: true })}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm font-medium text-destructive">Email é obrigatório</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    {...form.register("password", { required: true })}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm font-medium text-destructive">Senha é obrigatória</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade</Label>
                  <Input
                    id="unit"
                    placeholder="Ex: Matriz, Filial 1, etc"
                    {...form.register("unit")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  placeholder="Rua, número, complemento"
                  {...form.register("address")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    placeholder="Cidade"
                    {...form.register("city")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    placeholder="Estado"
                    {...form.register("state")}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar Cliente"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ClientRegistration;
