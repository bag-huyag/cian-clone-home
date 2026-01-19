import { useState, useEffect } from "react";
import { Property } from "@/data/properties";

const STORAGE_KEY = "user_listings";

export interface UserListing extends Omit<Property, "id"> {
  id: string;
  createdAt: string;
  status: "active" | "pending" | "archived";
}

export const useUserListings = () => {
  const [listings, setListings] = useState<UserListing[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setListings(JSON.parse(stored));
    }
  }, []);

  const saveListings = (newListings: UserListing[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newListings));
    setListings(newListings);
  };

  const addListing = (listing: Omit<UserListing, "id" | "createdAt" | "status">) => {
    const newListing: UserListing = {
      ...listing,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    const newListings = [...listings, newListing];
    saveListings(newListings);
    return newListing;
  };

  const updateListing = (id: string, updates: Partial<UserListing>) => {
    const newListings = listings.map((listing) =>
      listing.id === id ? { ...listing, ...updates } : listing
    );
    saveListings(newListings);
  };

  const deleteListing = (id: string) => {
    const newListings = listings.filter((listing) => listing.id !== id);
    saveListings(newListings);
  };

  const getListing = (id: string) => {
    return listings.find((listing) => listing.id === id);
  };

  return {
    listings,
    addListing,
    updateListing,
    deleteListing,
    getListing,
  };
};
