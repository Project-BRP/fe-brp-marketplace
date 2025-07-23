"use client";

import { usePackagings, useProductTypes } from "@/app/admin/hooks/useMeta";
import { Checkbox } from "@/components/Checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import { Input } from "@/components/InputLovable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Skeleton } from "@/components/Skeleton";
import Button from "@/components/buttons/Button";
import LabelText from "@/components/form/LabelText";

// Define the shape of the filters object
export interface AdvancedFilters {
  productTypeId: string;
  packagingIds: string[];
  minPrice: string;
  maxPrice: string;
}

type FilterModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  filters: AdvancedFilters;
  onFilterChange: (newFilters: Partial<AdvancedFilters>) => void;
  onReset: () => void;
};

export default function FilterModal({
  isOpen,
  onOpenChange,
  filters,
  onFilterChange,
  onReset,
}: FilterModalProps) {
  const { data: productTypes, isLoading: isLoadingTypes } = useProductTypes();
  const { data: packagings, isLoading: isLoadingPackagings } = usePackagings();

  const handlePackagingChange = (packagingId: string) => {
    const newPackagingIds = filters.packagingIds.includes(packagingId)
      ? filters.packagingIds.filter((id) => id !== packagingId)
      : [...filters.packagingIds, packagingId];
    onFilterChange({ packagingIds: newPackagingIds });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Lanjutan</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Product Type Filter */}
          <div className="grid grid-cols-4 items-center gap-4">
            <LabelText labelTextClasname="text-right">Tipe</LabelText>
            {isLoadingTypes ? (
              <Skeleton className="h-10 col-span-3" />
            ) : (
              <Select
                value={filters.productTypeId}
                onValueChange={(value) =>
                  onFilterChange({ productTypeId: value })
                }
              >
                <SelectTrigger id="product-type" className="col-span-3">
                  <SelectValue placeholder="Pilih tipe produk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semua">Semua Tipe</SelectItem>
                  {productTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Packaging Filter (Checkbox) */}
          <div className="grid grid-cols-4 items-start gap-4">
            <LabelText labelTextClasname="text-right pt-2">Kemasan</LabelText>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              {isLoadingPackagings
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))
                : packagings?.map((pkg) => (
                    <div key={pkg.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pkg-${pkg.id}`}
                        checked={filters.packagingIds.includes(pkg.id)}
                        onCheckedChange={() => handlePackagingChange(pkg.id)}
                      />
                      <label
                        htmlFor={`pkg-${pkg.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {pkg.name}
                      </label>
                    </div>
                  ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="grid grid-cols-4 items-center gap-4">
            <LabelText labelTextClasname="text-right">Harga (Rp)</LabelText>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                type="number"
                placeholder="Minimum"
                value={filters.minPrice}
                onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Maksimum"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onReset}>
            Reset Filter
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Terapkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
