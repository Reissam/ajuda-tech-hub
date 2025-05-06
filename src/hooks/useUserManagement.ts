
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  active?: boolean;
  created_at: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  created_at: Date;
}

export const useUserManagement = () => {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users from Supabase
  const { data: profilesData = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        console.log("Fetching users from Supabase...");
        
        // Primeiro, verifica se existem perfis
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('name', { ascending: true });
        
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          throw profilesError;
        }
        
        console.log("Profiles found:", profiles?.length || 0);
        console.log("Profiles data:", profiles);
        
        // Se não há perfis, tenta buscar usuários da auth e criar perfis para eles
        if (!profiles || profiles.length === 0) {
          console.log("No profiles found, trying to fetch auth users and create profiles");
          
          // Buscar informações do usuário atual para determinar se é admin
          const { data: currentUserData } = await supabase.auth.getUser();
          const currentUser = currentUserData?.user;
          
          if (currentUser && currentUser.email?.includes('admin')) {
            console.log("Current user is admin, creating profiles for auth users");
            
            // Apenas para debug - na prática, seria ideal usar uma função do Supabase para isto
            const dummyProfiles = [
              {
                id: currentUser.id,
                name: 'Admin Demo',
                email: currentUser.email,
                role: 'admin',
                active: true,
                created_at: new Date().toISOString()
              }
            ];
            
            // Criar perfil para o usuário admin atual
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(dummyProfiles);
              
            if (insertError) {
              console.error("Error creating profile for admin:", insertError);
            } else {
              console.log("Created profile for admin user");
              return dummyProfiles as ProfileData[];
            }
          }
        }
        
        return profiles as ProfileData[];
      } catch (error: any) {
        console.error("Error in queryFn:", error);
        toast.error(`Erro ao carregar usuários: ${error.message}`);
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Transform profiles data to match UserData interface
  const users: UserData[] = profilesData.map(profile => ({
    id: profile.id,
    name: profile.name || 'Sem nome',
    email: profile.email || 'Sem email',
    role: (profile.role as UserRole) || UserRole.CLIENT,
    active: profile.active !== undefined ? profile.active : true, // Default to true if not specified
    created_at: new Date(profile.created_at || new Date())
  }));

  const handleAddUser = () => {
    toast.info("Funcionalidade de adicionar usuário será implementada em breve.");
  };

  const handleEditUser = (userId: string) => {
    toast.info(`Editar usuário com ID: ${userId}`);
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ active: !currentStatus })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      toast.success(`Status do usuário atualizado com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast.error(`Erro ao atualizar status: ${error.message}`);
    }
  };

  const handleRefreshUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    toast.info("Atualizando lista de usuários...");
  };

  // Filtrar usuários com base nos filtros e busca
  const filteredUsers = users.filter((u) => {
    // Filtro por papel
    if (roleFilter !== "all" && u.role !== roleFilter) {
      return false;
    }

    // Filtro por status
    if (
      statusFilter !== "all" &&
      ((statusFilter === "active" && !u.active) ||
        (statusFilter === "inactive" && u.active))
    ) {
      return false;
    }

    // Filtro por busca (nome ou email)
    if (
      searchQuery &&
      !u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !u.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return {
    isLoading,
    filteredUsers,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    handleAddUser,
    handleEditUser,
    handleToggleUserStatus,
    handleRefreshUsers
  };
};
