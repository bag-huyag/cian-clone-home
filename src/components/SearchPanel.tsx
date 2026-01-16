import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  propertyType: string;
  setPropertyType: (type: string) => void;
  roomCount: string;
  setRoomCount: (count: string) => void;
}

const SearchPanel = ({
  searchQuery,
  setSearchQuery,
  propertyType,
  setPropertyType,
  roomCount,
  setRoomCount,
}: SearchPanelProps) => {
  return (
    <div className="bg-card border-b border-border py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Город, адрес, район, метро..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* Property Type */}
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-full md:w-48 h-12">
              <SelectValue placeholder="Тип недвижимости" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="apartment">Квартира</SelectItem>
              <SelectItem value="house">Дом</SelectItem>
              <SelectItem value="room">Комната</SelectItem>
            </SelectContent>
          </Select>

          {/* Room Count */}
          <Select value={roomCount} onValueChange={setRoomCount}>
            <SelectTrigger className="w-full md:w-40 h-12">
              <SelectValue placeholder="Комнаты" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Любое</SelectItem>
              <SelectItem value="studio">Студия</SelectItem>
              <SelectItem value="1">1 комната</SelectItem>
              <SelectItem value="2">2 комнаты</SelectItem>
              <SelectItem value="3">3 комнаты</SelectItem>
              <SelectItem value="4+">4+ комнат</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Button */}
          <Button className="h-12 px-8 gap-2">
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Найти</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
