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
  { id: "panel", label: "Панелӣ" },
  { id: "brick", label: "Хиштӣ" },
  { id: "monolith", label: "Монолитӣ" },
  { id: "block", label: "Блокӣ" },
];

const floorOptions = [
  { id: "not-first", label: "На аввалин" },
  { id: "not-last", label: "На охирин" },
  { id: "only-last", label: "Танҳо охирин" },
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
    return `${value.toLocaleString()} сомонӣ`;
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
      <h2 className="text-lg font-semibold text-foreground mb-6">Филтрҳо</h2>

      {/* Price Range */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-foreground mb-4 block">
          Нарх, сомонӣ
        </Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={50000}
            max={2000000}
            step={10000}
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
          Навъи бино
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
          Ошёна
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

      <Button className="w-full">Нишон додани эълонҳо</Button>
    </aside>
  );
};

export default FilterPanel;
