import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FilterPanelProps {
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  houseTypes: string[];
  setHouseTypes: (types: string[]) => void;
  floors: string[];
  setFloors: (floors: string[]) => void;
}

const houseTypeOptions = [
  { id: "panel", label: "Панельный" },
  { id: "brick", label: "Кирпичный" },
  { id: "monolith", label: "Монолитный" },
  { id: "block", label: "Блочный" },
];

const floorOptions = [
  { id: "not-first", label: "Не первый" },
  { id: "not-last", label: "Не последний" },
  { id: "only-last", label: "Только последний" },
];

const FilterPanel = ({
  priceRange,
  setPriceRange,
  houseTypes,
  setHouseTypes,
  floors,
  setFloors,
}: FilterPanelProps) => {
  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} млн`;
    }
    return `${value.toLocaleString()} ₽`;
  };

  const toggleHouseType = (id: string) => {
    if (houseTypes.includes(id)) {
      setHouseTypes(houseTypes.filter((t) => t !== id));
    } else {
      setHouseTypes([...houseTypes, id]);
    }
  };

  const toggleFloor = (id: string) => {
    if (floors.includes(id)) {
      setFloors(floors.filter((f) => f !== id));
    } else {
      setFloors([...floors, id]);
    }
  };

  return (
    <aside className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-6">Фильтры</h2>

      {/* Price Range */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-foreground mb-4 block">
          Цена, ₽
        </Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={1000000}
            max={50000000}
            step={500000}
            className="mb-3"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* House Type */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-foreground mb-4 block">
          Тип дома
        </Label>
        <div className="space-y-3">
          {houseTypeOptions.map((option) => (
            <div key={option.id} className="flex items-center gap-3">
              <Checkbox
                id={option.id}
                checked={houseTypes.includes(option.id)}
                onCheckedChange={() => toggleHouseType(option.id)}
              />
              <label
                htmlFor={option.id}
                className="text-sm text-foreground cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Floor */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-foreground mb-4 block">
          Этаж
        </Label>
        <div className="space-y-3">
          {floorOptions.map((option) => (
            <div key={option.id} className="flex items-center gap-3">
              <Checkbox
                id={option.id}
                checked={floors.includes(option.id)}
                onCheckedChange={() => toggleFloor(option.id)}
              />
              <label
                htmlFor={option.id}
                className="text-sm text-foreground cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full">Показать объявления</Button>
    </aside>
  );
};

export default FilterPanel;
