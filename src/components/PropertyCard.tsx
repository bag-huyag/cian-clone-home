import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Property } from "@/data/properties";

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const PropertyCard = ({ property, isFavorite, onToggleFavorite }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  const getMetroColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      red: "bg-metro-red",
      green: "bg-metro-green",
      blue: "bg-metro-blue",
      orange: "bg-metro-orange",
      purple: "bg-metro-purple",
    };
    return colorMap[color] || "bg-metro-red";
  };

  return (
    <article className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow duration-200 group">
      {/* Image */}
      <Link to={`/property/${property.id}`} className="block relative aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={property.images[0]}
          alt={`${property.rooms} в ${property.district}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Image count badge */}
        {property.images.length > 1 && (
          <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {property.images.length} фото
          </span>
        )}
      </Link>
      
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite(property.id);
        }}
        className={cn(
          "absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10",
          isFavorite
            ? "bg-cian-red text-white"
            : "bg-white/90 text-muted-foreground hover:bg-white hover:text-cian-red"
        )}
        style={{ position: 'absolute', top: '12px', right: '12px' }}
      >
        <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
      </button>

      {/* Content */}
      <Link to={`/property/${property.id}`} className="block p-4">
        {/* Price */}
        <div className="text-xl font-bold text-foreground mb-2">
          {formatPrice(property.price)}
        </div>

        {/* Description */}
        <div className="text-sm text-foreground mb-2">
          {property.rooms}, {property.area} м², {property.floor}/{property.totalFloors} этаж
        </div>

        {/* Location */}
        <div className="text-sm text-muted-foreground mb-1">
          {property.district}
        </div>

        {/* Metro */}
        <div className="flex items-center gap-2 text-sm">
          <span className={cn("w-2 h-2 rounded-full", getMetroColorClass(property.metroColor))} />
          <span className="text-muted-foreground">{property.metro}</span>
          <span className="text-muted-foreground">• {property.metroTime} мин</span>
        </div>
      </Link>
    </article>
  );
};

export default PropertyCard;
