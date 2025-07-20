import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Input } from "@/components/InputLovable";
import Button from "@/components/buttons/Button";
import LabelText from "@/components/form/LabelText";
import { Filter, Search, X } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

export interface FilterOptions {
  npkFormula: string[];
  priceRange: { min: number; max: number };
  searchTerm: string;
}

const FilterBar = ({ onFilterChange, activeFilters }: FilterBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const npkOptions = [
    "15-15-15",
    "16-16-16",
    "12-12-17",
    "13-6-27",
    "13-8-27-4",
    "14-14-14",
    "20-10-10",
    "12-6-22",
    "15-5-20",
    "10-26-26",
  ];

  const handleNPKToggle = (formula: string) => {
    const newFormulas = activeFilters.npkFormula.includes(formula)
      ? activeFilters.npkFormula.filter((f) => f !== formula)
      : [...activeFilters.npkFormula, formula];

    onFilterChange({
      ...activeFilters,
      npkFormula: newFormulas,
    });
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = parseInt(value) || 0;
    onFilterChange({
      ...activeFilters,
      priceRange: {
        ...activeFilters.priceRange,
        [type]: numValue,
      },
    });
  };

  const handleSearchChange = (value: string) => {
    onFilterChange({
      ...activeFilters,
      searchTerm: value,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      npkFormula: [],
      priceRange: { min: 0, max: 0 },
      searchTerm: "",
    });
  };

  const activeFilterCount =
    activeFilters.npkFormula.length +
    (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max > 0
      ? 1
      : 0) +
    (activeFilters.searchTerm ? 1 : 0);

  return (
    <Card className="mb-6 border-border shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center">
            <Filter className="h-5 w-5 mr-2 text-primary" />
            Filter Produk
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-primary text-primary-foreground"
              >
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden"
            >
              {isExpanded ? "Tutup" : "Buka"} Filter
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={`${isExpanded ? "block" : "hidden"} md:block pt-0`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search Filter */}
          <div className="space-y-2">
            <LabelText labelTextClasname="text-sm font-medium text-foreground">
              Cari Produk
            </LabelText>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Nama produk..."
                value={activeFilters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 border-border focus:ring-primary"
                id={""}
              />
            </div>
          </div>

          {/* NPK Formula Filter */}
          <div className="space-y-2">
            <LabelText labelTextClasname="text-sm font-medium text-foreground">
              Formula NPK
            </LabelText>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {npkOptions.map((formula) => (
                <Badge
                  key={formula}
                  variant={
                    activeFilters.npkFormula.includes(formula)
                      ? "default"
                      : "outline"
                  }
                  className={`cursor-pointer transition-colors ${
                    activeFilters.npkFormula.includes(formula)
                      ? "bg-primary text-primary-foreground hover:bg-primary-dark"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => handleNPKToggle(formula)}
                >
                  {formula}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <LabelText labelTextClasname="text-sm font-medium text-foreground">
              Range Harga (IDR)
            </LabelText>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={activeFilters.priceRange.min || ""}
                onChange={(e) => handlePriceChange("min", e.target.value)}
                className="border-border focus:ring-primary"
                id={""}
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={activeFilters.priceRange.max || ""}
                onChange={(e) => handlePriceChange("max", e.target.value)}
                className="border-border focus:ring-primary"
                id={""}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
