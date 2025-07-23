"use client";

import { useProductTypes } from "@/app/admin/hooks/useMeta";
import { Input } from "@/components/InputLovable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Skeleton } from "@/components/Skeleton";
import { Search } from "lucide-react";

type FilterBarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
};

export default function FilterBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
}: FilterBarProps) {
  const { data: productTypes, isLoading } = useProductTypes();

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-card rounded-xl shadow-sm border">
      <div className="flex-1 w-full relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Cari nama produk..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 h-11 text-base"
        />
      </div>
      {isLoading ? (
        <Skeleton className="h-11 w-full md:w-[250px]" />
      ) : (
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full md:w-[250px] h-11 text-base">
            <SelectValue placeholder="Filter Tipe Produk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua">Semua Tipe</SelectItem>
            {Array.isArray(productTypes) &&
              productTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
