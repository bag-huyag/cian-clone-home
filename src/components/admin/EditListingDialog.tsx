import { useState, useEffect } from "react";
import { ListingWithUser } from "@/hooks/useAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ImageEditor } from "./ImageEditor";

interface EditListingDialogProps {
  listing: ListingWithUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ExtendedListing extends ListingWithUser {
  images?: string[];
  description?: string;
  floor?: number;
  total_floors?: number;
}

const cities = ["Душанбе", "Худжанд", "Бохтар", "Куляб", "Истаравшан"];
const propertyTypes = ["Квартира", "Дом", "Участок", "Коммерция"];
const roomOptions = ["1 комната", "2 комнаты", "3 комнаты", "4 комнаты", "5 комнат", "5+ комнат", "Без комнат"];
const statusOptions = [
  { value: "pending", label: "На модерации" },
  { value: "active", label: "Активно" },
  { value: "archived", label: "В архиве" },
  { value: "rejected", label: "Отклонено" },
];

export const EditListingDialog = ({ listing, open, onOpenChange }: EditListingDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    city: "",
    district: "",
    address: "",
    property_type: "",
    rooms: "",
    area: "",
    price: "",
    status: "",
    seller_name: "",
    seller_phone: "",
    description: "",
    floor: "",
    total_floors: "",
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (listing) {
      const extListing = listing as ExtendedListing;
      setImages(extListing.images || []);
      setFormData({
        city: listing.city || "",
        district: listing.district || "",
        address: listing.address || "",
        property_type: listing.property_type || "",
        rooms: listing.rooms || "",
        area: String(listing.area) || "",
        price: String(listing.price) || "",
        status: listing.status || "",
        seller_name: listing.seller_name || "",
        seller_phone: listing.seller_phone || "",
        description: (listing as any).description || "",
        floor: String((listing as any).floor || ""),
        total_floors: String((listing as any).total_floors || ""),
      });
    }
  }, [listing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("listings")
        .update({
          city: formData.city,
          district: formData.district,
          address: formData.address || null,
          property_type: formData.property_type,
          rooms: formData.rooms,
          area: Number(formData.area),
          price: Number(formData.price),
          status: formData.status,
          seller_name: formData.seller_name,
          seller_phone: formData.seller_phone,
          description: formData.description || null,
          floor: formData.floor ? Number(formData.floor) : null,
          images: images,
          total_floors: formData.total_floors ? Number(formData.total_floors) : null,
        })
        .eq("id", listing.id);

      if (error) throw error;

      toast({
        title: "Объявление обновлено",
        description: "Изменения успешно сохранены",
      });
      
      queryClient.invalidateQueries({ queryKey: ["adminListings"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактирование объявления</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Город</Label>
              <Select value={formData.city} onValueChange={(v) => setFormData({ ...formData, city: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите город" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Район</Label>
              <Input
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Адрес</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Тип недвижимости</Label>
              <Select value={formData.property_type} onValueChange={(v) => setFormData({ ...formData, property_type: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Количество комнат</Label>
              <Select value={formData.rooms} onValueChange={(v) => setFormData({ ...formData, rooms: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  {roomOptions.map((room) => (
                    <SelectItem key={room} value={room}>{room}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Площадь (м²)</Label>
              <Input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Этаж</Label>
              <Input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Всего этажей</Label>
              <Input
                type="number"
                value={formData.total_floors}
                onChange={(e) => setFormData({ ...formData, total_floors: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Цена ($)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Статус</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Имя продавца</Label>
              <Input
                value={formData.seller_name}
                onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Телефон продавца</Label>
              <Input
                value={formData.seller_phone}
                onChange={(e) => setFormData({ ...formData, seller_phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Описание</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {listing && (
            <ImageEditor
              images={images}
              onImagesChange={setImages}
              listingId={listing.id}
            />
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
