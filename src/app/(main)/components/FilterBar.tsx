"use client";

import { DollarSign, Package, Search, Tag } from "lucide-react";

import { usePackagings, useProductTypes } from "@/app/admin/hooks/useMeta";
import { Input } from "@/components/InputLovable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Skeleton } from "@/components/Skeleton";

// Props are updated to handle state for all new filters
type FilterBarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedPackaging: string;
  onPackagingChange: (value: string) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
};

export default function FilterBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedPackaging,
  onPackagingChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}: FilterBarProps) {
  const { data: productTypes, isLoading: isLoadingTypes } = useProductTypes();
  const { data: packagings, isLoading: isLoadingPackagings } = usePackagings();

  return (
    <div className="p-4 bg-card rounded-xl shadow-sm border space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Cari nama produk..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-11 h-11 text-base"
          />
        </div>

        {/* Product Type Select */}
        {isLoadingTypes ? (
          <Skeleton className="h-11 w-full" />
        ) : (
          <div className="relative">
            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="h-11 text-base pl-11">
                <SelectValue placeholder="Filter Tipe Produk" />
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
          </div>
        )}

        {/* Packaging Select */}
        {isLoadingPackagings ? (
          <Skeleton className="h-11 w-full" />
        ) : (
          <div className="relative">
            <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Select value={selectedPackaging} onValueChange={onPackagingChange}>
              <SelectTrigger className="h-11 text-base pl-11">
                <SelectValue placeholder="Filter Kemasan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Kemasan</SelectItem>
                {packagings?.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price Range Inputs */}
        <div className="relative">
          <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Harga Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="h-11 text-base pl-11 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="0"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Harga Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="h-11 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
