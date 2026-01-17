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
              placeholder="Шаҳр, суроға, ноҳия..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* Property Type */}
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-full md:w-48 h-12">
              <SelectValue placeholder="Навъи амвол" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Ҳама навъҳо</SelectItem>
              <SelectItem value="apartment">Хона</SelectItem>
              <SelectItem value="house">Ҳавлӣ</SelectItem>
              <SelectItem value="room">Ҳуҷра</SelectItem>
            </SelectContent>
          </Select>

          {/* Room Count */}
          <Select value={roomCount} onValueChange={setRoomCount}>
            <SelectTrigger className="w-full md:w-40 h-12">
              <SelectValue placeholder="Хонаҳо" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Ҳама</SelectItem>
              <SelectItem value="studio">Студия</SelectItem>
              <SelectItem value="1">1 хона</SelectItem>
              <SelectItem value="2">2 хона</SelectItem>
              <SelectItem value="3">3 хона</SelectItem>
              <SelectItem value="4+">4+ хона</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Button */}
          <Button className="h-12 px-8 gap-2">
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Ҷустуҷӯ</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
