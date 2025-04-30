
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Client } from "@/types/client";
import { Building, MapPin, Home } from "lucide-react";

interface ClientInfoCardProps {
  client: Client;
}

export const ClientInfoCard = ({ client }: ClientInfoCardProps) => {
  return (
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
            <p className="text-sm ml-6">{client.name}</p>
            
            <div className="flex items-center mb-2 mt-4">
              <Building className="h-4 w-4 mr-2 opacity-70" />
              <Label className="font-medium">Unidade:</Label>
            </div>
            <p className="text-sm ml-6">{client.unit}</p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <MapPin className="h-4 w-4 mr-2 opacity-70" />
              <Label className="font-medium">Endereço:</Label>
            </div>
            <p className="text-sm ml-6">{client.address}</p>
            
            <div className="flex items-center mb-2 mt-4">
              <Home className="h-4 w-4 mr-2 opacity-70" />
              <Label className="font-medium">Cidade/Estado:</Label>
            </div>
            <p className="text-sm ml-6">{client.city} - {client.state}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
