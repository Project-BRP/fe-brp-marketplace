"use client";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import Button from "@/components/buttons/Button";
import { useState } from "react";

import NextImage from "@/components/NextImage"; // Import NextImage
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Textarea } from "@/components/TextArea";
import LabelText from "@/components/form/LabelText";
import { Edit, Filter, Package, Plus, Search, Trash2 } from "lucide-react";

// Mock data produk
const products = [
  {
    id: 1,
    name: "NPK 15-15-15",
    image: "/dashboard/Hero.jpg", // Updated image path
    price: 150000,
    stock: 120,
    npk: "15-15-15",
    description:
      "Pupuk majemuk dengan kandungan nitrogen, fosfor, dan kalium seimbang",
  },
  {
    id: 2,
    name: "NPK 16-16-16",
    image: "/dashboard/Hero.jpg", // Updated image path
    price: 165000,
    stock: 95,
    npk: "16-16-16",
    description:
      "Pupuk premium dengan kandungan NPK tinggi untuk hasil maksimal",
  },
  {
    id: 3,
    name: "NPK 13-6-27",
    image: "/dashboard/Hero.jpg", // Updated image path
    price: 140000,
    stock: 78,
    npk: "13-6-27",
    description: "Pupuk khusus untuk fase pembungaan dengan kalium tinggi",
  },
  {
    id: 4,
    name: "NPK 12-12-17",
    image: "/dashboard/Hero.jpg", // Updated image path
    price: 135000,
    stock: 156,
    npk: "12-12-17",
    description: "Pupuk serbaguna untuk berbagai jenis tanaman",
  },
  {
    id: 5,
    name: "NPK 13-8-27-4",
    image: "/dashboard/Hero.jpg", // Updated image path
    price: 160000,
    stock: 89,
    npk: "13-8-27-4",
    description: "Pupuk dengan tambahan sulfur untuk hasil optimal",
  },
];

const npkOptions = [
  "Semua",
  "15-15-15",
  "16-16-16",
  "13-6-27",
  "12-12-17",
  "13-8-27-4",
];

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNPK, setSelectedNPK] = useState("Semua");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesNPK = selectedNPK === "Semua" || product.npk === selectedNPK;
    return matchesSearch && matchesNPK;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

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
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <LabelText>Nama Produk</LabelText>
                <Input id="productName" placeholder="NPK 15-15-15" />
              </div>
              <div className="space-y-2">
                <LabelText>Kandungan NPK</LabelText>
                <Input id="npkContent" placeholder="15-15-15" />
              </div>
              <div className="space-y-2">
                <LabelText>Harga (Rp)</LabelText>
                <Input id="price" type="number" placeholder="150000" />
              </div>
              <div className="space-y-2">
                <LabelText>Stok</LabelText>
                <Input id="stock" type="number" placeholder="100" />
              </div>
              <div className="col-span-2 space-y-2">
                <LabelText>Deskripsi</LabelText>
                <Textarea id="description" placeholder="Deskripsi produk..." />
              </div>
              <div className="col-span-2 space-y-2">
                <LabelText>Gambar Produk</LabelText>
                <Input id="image" type="file" accept="image/*" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Batal
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Simpan Produk
              </Button>
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
                <TableHead>NPK</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <NextImage
                        src="/dashboard/Hero.jpg"
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
                    <Badge variant="outline">{product.npk}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>{product.stock} karung</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.stock > 50 ? "default" : "destructive"}
                    >
                      {product.stock > 50 ? "Tersedia" : "Stok Terbatas"}
                    </Badge>
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
