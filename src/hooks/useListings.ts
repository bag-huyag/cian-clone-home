import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Listing {
  id: string;
  user_id: string;
  listing_type: "sale" | "rent";
  property_type: string;
  city: string;
  district: string;
  address: string | null;
  landmark: string | null;
  rooms: string;
  area: number;
  floor: number;
  total_floors: number;
  house_type: string | null;
  year_built: number | null;
  price: number;
  description: string | null;
  features: string[];
  images: string[];
  seller_name: string;
  seller_phone: string;
  seller_type: "owner" | "agent";
  status: "active" | "pending" | "archived";
  created_at: string;
  updated_at: string;
}

export const useListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserListings = async () => {
    if (!user) {
      setListings([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data as Listing[]);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserListings();
  }, [user]);

  const addListing = async (
    listing: Omit<Listing, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("listings")
        .insert({
          ...listing,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setListings((prev) => [data as Listing, ...prev]);
      return data as Listing;
    } catch (error) {
      console.error("Error adding listing:", error);
      return null;
    }
  };

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("listings")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id ? { ...listing, ...updates } : listing
        )
      );
      return true;
    } catch (error) {
      console.error("Error updating listing:", error);
      return false;
    }
  };

  const deleteListing = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      
      setListings((prev) => prev.filter((listing) => listing.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting listing:", error);
      return false;
    }
  };

  const getListing = async (id: string): Promise<Listing | null> => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Listing;
    } catch (error) {
      console.error("Error fetching listing:", error);
      return null;
    }
  };

  return {
    listings,
    loading,
    addListing,
    updateListing,
    deleteListing,
    getListing,
    refetch: fetchUserListings,
  };
};
