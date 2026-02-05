import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  profile: {
    full_name: string | null;
    phone: string | null;
    seller_type: string | null;
  } | null;
  roles: string[];
}

export interface ListingWithUser {
  id: string;
  city: string;
  district: string;
  address: string | null;
  property_type: string;
  rooms: string;
  area: number;
  price: number;
  status: string;
  created_at: string;
  seller_name: string;
  seller_phone: string;
  user_id: string;
}

export const useAdmin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if current user is admin
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }
      return data;
    },
    enabled: !!user,
  });

  // Fetch all listings for moderation
  const { data: allListings = [], isLoading: isLoadingListings } = useQuery({
    queryKey: ["adminListings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ListingWithUser[];
    },
    enabled: isAdmin === true,
  });

  // Fetch all profiles
  const { data: allProfiles = [], isLoading: isLoadingProfiles } = useQuery({
    queryKey: ["adminProfiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });

  // Fetch all user roles
  const { data: allRoles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ["adminRoles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*");
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });

  // Update listing status
  const updateListingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("listings")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminListings"] });
      toast({
        title: "Статус обновлён",
        description: "Статус объявления успешно изменён",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete listing
  const deleteListing = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminListings"] });
      toast({
        title: "Объявление удалено",
        description: "Объявление успешно удалено из системы",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add role to user
  const addRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "moderator" | "user" }) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminRoles"] });
      toast({
        title: "Роль добавлена",
        description: "Роль успешно назначена пользователю",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove role from user
  const removeRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "moderator" | "user" }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminRoles"] });
      toast({
        title: "Роль удалена",
        description: "Роль успешно снята с пользователя",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Bulk update listing status
  const bulkUpdateListingStatus = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      const { error } = await supabase
        .from("listings")
        .update({ status })
        .in("id", ids);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminListings"] });
      toast({
        title: "Статусы обновлены",
        description: `Изменён статус ${variables.ids.length} объявлений`,
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Bulk delete listings
  const bulkDeleteListings = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from("listings")
        .delete()
        .in("id", ids);
      
      if (error) throw error;
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ["adminListings"] });
      toast({
        title: "Объявления удалены",
        description: `Удалено ${ids.length} объявлений`,
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    isAdmin,
    isCheckingAdmin,
    allListings,
    isLoadingListings,
    allProfiles,
    isLoadingProfiles,
    allRoles,
    isLoadingRoles,
    updateListingStatus,
    deleteListing,
    addRole,
    removeRole,
    bulkUpdateListingStatus,
    bulkDeleteListings,
  };
};
