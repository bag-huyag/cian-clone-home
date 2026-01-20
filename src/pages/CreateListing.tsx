import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useListings } from "@/hooks/useListings";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const cities = [
  "Душанбе",
  "Хуҷанд",
  "Бохтар",
  "Кӯлоб",
  "Истаравшан",
  "Турсунзода",
  "Исфара",
  "Панҷакент",
  "Вахдат",
  "Конибодом",
];

const districts: Record<string, string[]> = {
  "Душанбе": ["Фирдавсӣ", "Шоҳмансур", "Исмоили Сомонӣ", "Сино", "Борбад", "Варзоб", "Маркази шаҳр"],
  "Хуҷанд": ["Маркази шаҳр", "Навсозиҳо", "Панҷшанбе", "Арбоб"],
  "Бохтар": ["Маркази шаҳр", "Ҷомӣ", "Левакант"],
  "Кӯлоб": ["Маркази шаҳр", "Зарафшон"],
  "Истаравшан": ["Маркази шаҳр"],
  "Турсунзода": ["Маркази шаҳр", "Регар"],
  "Исфара": ["Маркази шаҳр"],
  "Панҷакент": ["Маркази шаҳр"],
  "Вахдат": ["Маркази шаҳр"],
  "Конибодом": ["Маркази шаҳр"],
};

const features = [
  "Балкон",
  "Кондитсионер",
  "Ошхонаи дарунсохт",
  "Гардероб",
  "Ҷойгоҳи мошин",
  "Мебел",
  "Техника",
  "Интернет",
  "Домофон",
  "Консьерж",
  "Гараж",
  "Ҳаммоми тоҷикӣ",
  "Камин",
  "Шифти баланд",
  "Тирезаҳои панорамӣ",
];

const CreateListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addListing } = useListings();
  const { user, loading: authLoading } = useAuth();
  
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");
  const [propertyType, setPropertyType] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [rooms, setRooms] = useState("");
  const [area, setArea] = useState("");
  const [floor, setFloor] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [houseType, setHouseType] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerType, setSellerType] = useState<"owner" | "agent">("owner");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const getRoomsLabel = (roomValue: string) => {
    const roomsMap: Record<string, string> = {
      "studio": "Студия",
      "1": "1-хонагӣ",
      "2": "2-хонагӣ",
      "3": "3-хонагӣ",
      "4": "4-хонагӣ",
      "5+": "5+-хонагӣ",
    };
    return roomsMap[roomValue] || roomValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!propertyType || !city || !district || !rooms || !area || !price || !sellerName || !sellerPhone) {
      toast({
        title: "Хатогӣ",
        description: "Лутфан ҳамаи майдонҳои зарурӣро пур кунед",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Хатогӣ",
        description: "Лутфан ҳадди ақал як сурат илова кунед",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addListing({
        listing_type: listingType,
        property_type: propertyType,
        city,
        district,
        address,
        landmark,
        rooms: getRoomsLabel(rooms),
        area: Number(area),
        floor: Number(floor) || 1,
        total_floors: Number(totalFloors) || 1,
        house_type: houseType || null,
        year_built: Number(yearBuilt) || null,
        price: Number(price),
        description,
        features: selectedFeatures,
        images,
        seller_name: sellerName,
        seller_phone: sellerPhone,
        seller_type: sellerType,
        status: "pending",
      });

      if (result) {
        toast({
          title: "Муваффақият!",
          description: "Эълони шумо барои тасдиқ фиристода шуд",
        });
        navigate("/profile");
      } else {
        toast({
          title: "Хатогӣ",
          description: "Эълон илова нашуд. Лутфан дубора кӯшиш кунед.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Хатогӣ",
        description: "Хатогии сервер рӯй дод",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Бор мешавад...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header favoritesCount={0} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Back button */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Бозгашт</span>
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Эълони нав гузоштан
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Listing Type */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">Навъи эълон</h2>
              <RadioGroup
                value={listingType}
                onValueChange={(value) => setListingType(value as "sale" | "rent")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sale" id="sale" />
                  <Label htmlFor="sale" className="cursor-pointer">Фурӯш</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rent" id="rent" />
                  <Label htmlFor="rent" className="cursor-pointer">Иҷора</Label>
                </div>
              </RadioGroup>
            </section>

            {/* Property Type */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">Навъи мулк</h2>
              <RadioGroup
                value={propertyType}
                onValueChange={setPropertyType}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="apartment" id="apartment" />
                  <Label htmlFor="apartment" className="cursor-pointer">Хона</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="house" id="house" />
                  <Label htmlFor="house" className="cursor-pointer">Ҳавлӣ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="room" id="room" />
                  <Label htmlFor="room" className="cursor-pointer">Ҳуҷра</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="commercial" id="commercial" />
                  <Label htmlFor="commercial" className="cursor-pointer">Тиҷоратӣ</Label>
                </div>
              </RadioGroup>
            </section>

            {/* Location */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">Ҷойгиршавӣ</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Шаҳр *</Label>
                  <Select value={city} onValueChange={(value) => { setCity(value); setDistrict(""); }}>
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Интихоби шаҳр" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">Ноҳия *</Label>
                  <Select value={district} onValueChange={setDistrict} disabled={!city}>
                    <SelectTrigger id="district">
                      <SelectValue placeholder="Интихоби ноҳия" />
                    </SelectTrigger>
                    <SelectContent>
                      {(districts[city] || []).map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Суроға</Label>
                  <Input
                    id="address"
                    placeholder="кӯча, бино, ҳуҷра"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="landmark">Нуқтаи намоён</Label>
                  <Input
                    id="landmark"
                    placeholder="Наздик ба..."
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Property Details */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">Маълумот дар бораи мулк</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rooms">Шумораи хонаҳо *</Label>
                  <Select value={rooms} onValueChange={setRooms}>
                    <SelectTrigger id="rooms">
                      <SelectValue placeholder="Интихоб" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Студия</SelectItem>
                      <SelectItem value="1">1 хона</SelectItem>
                      <SelectItem value="2">2 хона</SelectItem>
                      <SelectItem value="3">3 хона</SelectItem>
                      <SelectItem value="4">4 хона</SelectItem>
                      <SelectItem value="5+">5+ хона</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Масоҳат, м² *</Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="0"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor">Ошёна</Label>
                  <Input
                    id="floor"
                    type="number"
                    placeholder="0"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalFloors">Ошёнаҳо дар бино</Label>
                  <Input
                    id="totalFloors"
                    type="number"
                    placeholder="0"
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="houseType">Навъи бино</Label>
                  <Select value={houseType} onValueChange={setHouseType}>
                    <SelectTrigger id="houseType">
                      <SelectValue placeholder="Интихоб" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="panel">Панелӣ</SelectItem>
                      <SelectItem value="brick">Хиштӣ</SelectItem>
                      <SelectItem value="monolith">Монолитӣ</SelectItem>
                      <SelectItem value="block">Блокӣ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">Соли сохтмон</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    placeholder="2020"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Price */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">Нарх</h2>
              <div className="space-y-2">
                <Label htmlFor="price">Нарх, сомонӣ *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="max-w-xs"
                />
                {listingType === "rent" && (
                  <p className="text-sm text-muted-foreground">дар як моҳ</p>
                )}
              </div>
            </section>

            {/* Images */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">Суратҳо</h2>
              <p className="text-sm text-muted-foreground mb-4">
                То 10 сурат илова кунед. Суратҳои сифатнок шуморо дар ҷустуҷӯ боло мебаранд.
              </p>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img
                      src={img}
                      alt={`Сурати ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                        Асосӣ
                      </span>
                    )}
                  </div>
                ))}
                
                {images.length < 10 && (
                  <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors">
                    <Camera className="w-8 h-8 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Илова</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </section>

            {/* Description */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">Тавсиф</h2>
              <div className="space-y-2">
                <Label htmlFor="description">Дар бораи мулки худ нависед</Label>
                <Textarea
                  id="description"
                  placeholder="Хусусиятҳо, ҳолат, инфраструктура..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>
            </section>

            {/* Features */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">Шароитҳо</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={selectedFeatures.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label htmlFor={feature} className="cursor-pointer text-sm">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </section>

            {/* Seller Info */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">Маълумоти тамос</h2>
              <div className="space-y-4">
                <RadioGroup
                  value={sellerType}
                  onValueChange={(value) => setSellerType(value as "owner" | "agent")}
                  className="flex gap-6 mb-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="owner" id="owner" />
                    <Label htmlFor="owner" className="cursor-pointer">Соҳиб</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="agent" id="agent" />
                    <Label htmlFor="agent" className="cursor-pointer">Агент</Label>
                  </div>
                </RadioGroup>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sellerName">Номи шумо *</Label>
                    <Input
                      id="sellerName"
                      placeholder="Ном ва насаб"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerPhone">Телефон *</Label>
                    <Input
                      id="sellerPhone"
                      type="tel"
                      placeholder="+992 (XX) XXX-XX-XX"
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Фиристодан..." : "Эълон гузоштан"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => navigate("/")}>
                Бекор кардан
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateListing;
