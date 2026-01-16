import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Phone, User, MapPin, Home, Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { properties } from "@/data/properties";
import ImageGallery from "@/components/ImageGallery";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PropertyDetail = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === Number(id));
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Объявление не найдено</h1>
          <Link to="/">
            <Button>Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  const pricePerMeter = Math.round(property.price / property.area);

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

  const getHouseTypeName = (type: string) => {
    const types: Record<string, string> = {
      panel: "Панельный",
      brick: "Кирпичный",
      monolith: "Монолитный",
      block: "Блочный",
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Назад к поиску</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-primary">ЦИАН</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <ImageGallery images={property.images} title={property.rooms} />

            {/* Title & Price (Mobile) */}
            <div className="lg:hidden space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {property.rooms}
                </h1>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(property.price)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(pricePerMeter)} за м²
                </p>
              </div>
            </div>

            {/* Main Info */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Основная информация</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Площадь</p>
                    <p className="font-medium text-foreground">{property.area} м²</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Этаж</p>
                    <p className="font-medium text-foreground">{property.floor} из {property.totalFloors}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Тип дома</p>
                    <p className="font-medium text-foreground">{getHouseTypeName(property.houseType)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Год постройки</p>
                    <p className="font-medium text-foreground">{property.yearBuilt}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Расположение</h2>
              
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{property.address}</p>
                  <p className="text-sm text-muted-foreground">{property.district}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={cn("w-3 h-3 rounded-full", getMetroColorClass(property.metroColor))} />
                <span className="text-foreground">{property.metro}</span>
                <span className="text-muted-foreground">• {property.metroTime} мин пешком</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Описание</h2>
              <p className="text-foreground leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            {property.features.length > 0 && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Удобства</h2>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sticky Contact Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Price Card (Desktop) */}
              <div className="hidden lg:block bg-card rounded-xl p-6 border border-border">
                <h1 className="text-xl font-bold text-foreground mb-2">
                  {property.rooms}
                </h1>
                <p className="text-3xl font-bold text-primary mb-1">
                  {formatPrice(property.price)}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {formatPrice(pricePerMeter)} за м²
                </p>
                
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={cn("w-5 h-5", isFavorite && "fill-cian-red text-cian-red")} />
                  {isFavorite ? "В избранном" : "В избранное"}
                </Button>
              </div>

              {/* Seller Card */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Контакты</h2>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{property.seller.name}</p>
                    <Badge variant={property.seller.type === "owner" ? "default" : "secondary"}>
                      {property.seller.type === "owner" ? "Собственник" : "Агент"}
                    </Badge>
                  </div>
                </div>

                {showPhone ? (
                  <a href={`tel:${property.seller.phone}`} className="block">
                    <Button className="w-full gap-2 text-lg">
                      <Phone className="w-5 h-5" />
                      {property.seller.phone}
                    </Button>
                  </a>
                ) : (
                  <Button className="w-full gap-2" onClick={() => setShowPhone(true)}>
                    <Phone className="w-5 h-5" />
                    Показать телефон
                  </Button>
                )}

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Пожалуйста, скажите, что нашли объявление на ЦИАН
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
