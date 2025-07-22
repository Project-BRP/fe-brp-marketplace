"use client";
import {
  useDeleteProduct,
  useGetAllProducts,
} from "@/app/(main)/hooks/useProduct";
import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import { Input } from "@/components/InputLovable";
import NextImage from "@/components/NextImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import Button from "@/components/buttons/Button";
import {
  Edit,
  Filter,
  Loader2,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";

// NOTE: This component still needs form handling logic for creating/editing products.

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNPK, setSelectedNPK] = useState("Semua");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: products = [], isLoading, isError } = useGetAllProducts();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // Safely filter products, ensuring variants exists before filtering
  const filteredProducts =
    products?.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Use optional chaining (?.) to safely access variants
      const matchesNPK =
        selectedNPK === "Semua" ||
        product.variants?.some((v) => v.composition.includes(selectedNPK));
      return matchesSearch && matchesNPK;
    }) ?? []; // Default to an empty array if products is undefined

  // Safely generate NPK options for the filter dropdown
  const npkOptions = [
    "Semua",
    ...Array.from(
      new Set(
        products
          ?.flatMap((p) => p.variants?.map((v) => v.composition) ?? [])
          .filter(Boolean) ?? [], // Filter out any undefined values
      ),
    ),
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Failed to load products. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manajemen Produk
          </h1>
          <p className="text-muted-foreground">
            Kelola produk pupuk NPK di toko Anda
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Produk Baru</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-center">
              Product creation form goes here.
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedNPK} onValueChange={setSelectedNPK}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter NPK" />
              </SelectTrigger>
              <SelectContent>
                {npkOptions.map((npk) => (
                  <SelectItem key={npk} value={npk}>
                    {npk}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Daftar Produk ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Harga (varian termurah)</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <NextImage
                        // Safely access the image URL with optional chaining
                        src={
                          product.variants?.[0]?.imageUrl ??
                          "/dashboard/Hero.jpg"
                        }
                        alt={product.name}
                        width={48}
                        height={48}
                        className="rounded-lg bg-muted"
                        imgClassName="object-cover w-full h-full rounded-lg"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.description.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {product.productType?.name ?? "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {/* Safely access variants before calculating price */}
                    {product.variants?.length > 0
                      ? formatPrice(
                          Math.min(
                            ...product.variants.map((v) => v.priceRupiah),
                          ),
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteProduct(product.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
