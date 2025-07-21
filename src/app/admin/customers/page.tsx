"use client";
import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
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
import { Edit, Filter, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";

// Mock data for customers
const customers = [
  {
    id: "USR001",
    name: "Budi Santoso",
    email: "budi.santoso@example.com",
    avatar: "/dashboard/Hero.jpg",
    totalOrders: 12,
    status: "Aktif",
    joinDate: "2023-01-15",
  },
  {
    id: "USR002",
    name: "Citra Lestari",
    email: "citra.lestari@example.com",
    avatar: "/dashboard/Hero.jpg",
    totalOrders: 8,
    status: "Aktif",
    joinDate: "2023-02-20",
  },
  {
    id: "USR003",
    name: "Agus Wijaya",
    email: "agus.wijaya@example.com",
    avatar: "/dashboard/Hero.jpg",
    totalOrders: 3,
    status: "Tidak Aktif",
    joinDate: "2023-03-10",
  },
  {
    id: "USR004",
    name: "Dewi Anggraini",
    email: "dewi.anggraini@example.com",
    avatar: "/dashboard/Hero.jpg",
    totalOrders: 25,
    status: "Aktif",
    joinDate: "2022-11-05",
  },
  {
    id: "USR005",
    name: "Eko Prasetyo",
    email: "eko.prasetyo@example.com",
    avatar: "/dashboard/Hero.jpg",
    totalOrders: 1,
    status: "Aktif",
    joinDate: "2023-05-01",
  },
];

const statusOptions = ["Semua", "Aktif", "Tidak Aktif"];

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "Semua" || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Manajemen Pelanggan
        </h1>
        <p className="text-muted-foreground">
          Lihat dan kelola data pelanggan Anda
        </p>
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
                  placeholder="Cari nama atau email pelanggan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daftar Pelanggan ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Total Pesanan</TableHead>
                <TableHead>Tanggal Bergabung</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <NextImage
                        src={customer.avatar}
                        alt={customer.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        imgClassName="object-cover w-full h-full rounded-full"
                      />
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.totalOrders}
                  </TableCell>
                  <TableCell>{customer.joinDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.status === "Aktif" ? "default" : "secondary"
                      }
                    >
                      {customer.status}
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
