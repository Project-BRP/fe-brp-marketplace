"use client";

import { Filter, List, Search } from "lucide-react";

import { Input } from "@/components/InputLovable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import Button from "@/components/buttons/Button";

type FilterBarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  limit: number;
  onLimitChange: (value: string) => void;
  onOpenFilterModal: () => void;
};

export default function FilterBar({
  searchTerm,
  onSearchChange,
  limit,
  onLimitChange,
  onOpenFilterModal,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-card rounded-xl shadow-sm border">
      {/* Search Input */}
      <div className="flex-1 w-full relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Cari nama produk..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 h-11 text-base"
        />
      </div>

      {/* Items per page Select */}
      <div className="relative w-full md:w-auto">
        <List className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
        <Select value={String(limit)} onValueChange={onLimitChange}>
          <SelectTrigger className="w-full md:w-[150px] h-11 text-base pl-11">
            <SelectValue placeholder="Item per Halaman" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4 Produk</SelectItem>
            <SelectItem value="8">8 Produk</SelectItem>
            <SelectItem value="12">12 Produk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filter Button */}
      <Button
        variant="outline"
        className="h-11 w-full md:w-auto"
        onClick={onOpenFilterModal}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filter Lanjutan
      </Button>
    </div>
  );
}
