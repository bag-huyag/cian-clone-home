import PropertyCard from "./PropertyCard";
import { Property } from "@/data/properties";

interface PropertyGridProps {
  properties: Property[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}

const PropertyGrid = ({ properties, favorites, onToggleFavorite }: PropertyGridProps) => {
  if (properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-card rounded-xl border border-border">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-2">Объявления не найдены</p>
          <p className="text-sm text-muted-foreground">Попробуйте изменить параметры поиска</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favorites.includes(property.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;
