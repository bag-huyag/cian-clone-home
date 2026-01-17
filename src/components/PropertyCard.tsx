import { Heart, MapPin } from "lucide-react";
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
    return new Intl.NumberFormat("tg-TJ").format(price) + " сомонӣ";
  };

  return (
    <article className="relative bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow duration-200 group">
      {/* Image */}
      <Link to={`/property/${property.id}`} className="block relative aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={property.images[0]}
          alt={`${property.rooms} дар ${property.district}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Image count badge */}
        {property.images.length > 1 && (
          <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {property.images.length} акс
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
          {property.rooms}, {property.area} м², ошёнаи {property.floor}/{property.totalFloors}
        </div>

        {/* Location */}
        <div className="text-sm text-muted-foreground mb-1">
          {property.city}, {property.district}
        </div>

        {/* Landmark */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{property.landmark}</span>
          <span className="text-muted-foreground">• {property.landmarkTime} дақ</span>
        </div>
      </Link>
    </article>
  );
};

export default PropertyCard;
