
import { User, UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const getOrCreateUserProfile = async (userId: string, email: string): Promise<User | null> => {
  try {
    console.log(`Checking profile for user ${userId} (${email})`);
    
    // First try to fetch the profile
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);

    if (fetchError) {
      console.error("Error fetching profiles:", fetchError);
      throw fetchError;
    }

    // Verify if profile exists
    if (profiles && profiles.length > 0) {
      console.log("Profile found:", profiles[0]);
      const profile = profiles[0];
      
      return {
        id: userId,
        email,
        name: profile.name,
        role: profile.role as UserRole
      };
    }
    
    console.log(`No profile found for ${userId}, creating new profile`);
    
    // Determine role based on email
    let role = UserRole.CLIENT;
    let name = email.split('@')[0];
    
    if (email.includes("admin")) {
      role = UserRole.ADMIN;
      name = "Admin Demo";
    } else if (email.includes("gestor")) {
      role = UserRole.MANAGER;
      name = "Gestor Demo";
    } else if (email.includes("tecnico")) {
      role = UserRole.TECHNICIAN;
      name = "Técnico Demo";
    }

    // Create profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: userId, 
          email, 
          name,
          role
        }
      ])
      .select();

    if (insertError) {
      console.error("Error creating profile:", insertError);
      // Create a fallback user in case of error
      return {
        id: userId,
        email,
        name,
        role
      };
    }

    if (newProfile && newProfile.length > 0) {
      console.log("New profile created:", newProfile[0]);
      
      return {
        id: userId,
        email,
        name: newProfile[0].name,
        role: newProfile[0].role as UserRole
      };
    }
    
    // Fallback case
    return {
      id: userId,
      email,
      name,
      role
    };
  } catch (error) {
    console.error("Erro ao buscar/criar perfil:", error);
    // Fallback user in case of error
    const fallbackUser: User = {
      id: userId,
      email,
      name: email.includes("admin") ? "Admin Demo" : email.split('@')[0],
      role: email.includes("admin") ? UserRole.ADMIN : UserRole.CLIENT
    };
    return fallbackUser;
  }
};
