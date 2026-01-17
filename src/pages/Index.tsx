import { useState, useMemo } from "react";
import Header from "@/components/Header";
import SearchPanel from "@/components/SearchPanel";
import FilterPanel from "@/components/FilterPanel";
import PropertyGrid from "@/components/PropertyGrid";
import Footer from "@/components/Footer";
import { properties } from "@/data/properties";

const Index = () => {
  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [roomCount, setRoomCount] = useState("all");
  const [priceRange, setPriceRange] = useState([50000, 2000000]);
  const [houseTypes, setHouseTypes] = useState<string[]>([]);
  const [floors, setFloors] = useState<string[]>([]);
  
  // Favorites state
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Filter properties based on all criteria
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          property.district.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query) ||
          property.landmark.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Property type filter
      if (propertyType !== "all" && property.type !== propertyType) {
        return false;
      }

      // Room count filter
      if (roomCount !== "all" && property.roomCount !== roomCount) {
        return false;
      }

      // Price range filter
      if (property.price < priceRange[0] || property.price > priceRange[1]) {
        return false;
      }

      // House type filter
      if (houseTypes.length > 0 && !houseTypes.includes(property.houseType)) {
        return false;
      }

      // Floor filter
      if (floors.length > 0) {
        if (floors.includes("not-first") && property.floor === 1) {
          return false;
        }
        if (floors.includes("not-last") && property.floor === property.totalFloors) {
          return false;
        }
        if (floors.includes("only-last") && property.floor !== property.totalFloors) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, propertyType, roomCount, priceRange, houseTypes, floors]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header favoritesCount={favorites.length} />
      
      <SearchPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        roomCount={roomCount}
        setRoomCount={setRoomCount}
      />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-72 shrink-0">
            <FilterPanel
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              houseTypes={houseTypes}
              setHouseTypes={setHouseTypes}
              floors={floors}
              setFloors={setFloors}
            />
          </div>

          {/* Property Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredProperties.length} эълон ёфт шуд
            </div>
            <PropertyGrid
              properties={filteredProperties}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
