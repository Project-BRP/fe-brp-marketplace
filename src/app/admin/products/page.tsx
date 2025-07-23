"use client";

import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  Info,
  Loader2,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import FilterModal, {
  AdvancedFilters,
} from "@/app/(main)/components/FilterModal";
import { useGetAllProducts } from "@/app/(main)/hooks/useProduct";
import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "@/app/admin/hooks/useAdminProduct";
import { usePackagings, useProductTypes } from "@/app/admin/hooks/useMeta";
import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Separator } from "@/components/Separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import { CreateProductPayload, Product } from "@/types/product";

const initialAdvancedFilters: AdvancedFilters = {
  productTypeId: "Semua",
  packagingIds: [],
  minPrice: "",
  maxPrice: "",
};

export default function AdminProducts() {
  // --- Modal and Editing State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // --- Filtering & Pagination State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(
    initialAdvancedFilters,
  );

  // --- Data Fetching ---
  const {
    data: productData,
    isLoading,
    isError,
  } = useGetAllProducts({
    limit: 1000, // Fetch all to filter on client
    search: debouncedSearchTerm,
    productTypeId: advancedFilters.productTypeId,
  });
  const { data: productTypes = [] } = useProductTypes();
  const { data: packagings = [] } = usePackagings();

  // --- Mutations ---
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  // --- Client-side Filtering Logic ---
  const clientFilteredProducts = useMemo(() => {
    const initialProducts = productData?.products ?? [];
    return initialProducts.filter((product) => {
      const { packagingIds, minPrice, maxPrice } = advancedFilters;

      const hasMatchingPackaging =
        packagingIds.length === 0 ||
        product.variants.some(
          (v) => v.packagingId && packagingIds.includes(v.packagingId),
        );
      if (!hasMatchingPackaging) return false;

      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;
      const hasMatchingPrice = product.variants.some(
        (v) => v.priceRupiah >= min && v.priceRupiah <= max,
      );
      if (!hasMatchingPrice) return false;

      return true;
    });
  }, [productData, advancedFilters]);

  // --- Pagination Logic ---
  const paginatedProducts = useMemo(() => {
    const totalPages = Math.ceil(clientFilteredProducts.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const productsOnPage = clientFilteredProducts.slice(startIndex, endIndex);
    return { products: productsOnPage, totalPages };
  }, [clientFilteredProducts, page, limit]);

  // --- Helper Functions ---
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // --- Event Handlers ---
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= paginatedProducts.totalPages) {
      setPage(newPage);
    }
  };

  const handleFilterChange = (value: string) => {
    setPage(1);
    setAdvancedFilters((prev) => ({ ...prev, productTypeId: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearchTerm(e.target.value);
  };

  const handleResetFilters = () => {
    setPage(1);
    setAdvancedFilters(initialAdvancedFilters);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleInfo = (product: Product) => {
    setViewingProduct(product);
    setIsInfoModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
    }
  };

  const handleFormSubmit = (data: CreateProductPayload) => {
    const onSuccess = () => setIsModalOpen(false);
    if (editingProduct) {
      updateProduct({ id: editingProduct.id, payload: data }, { onSuccess });
    } else {
      createProduct(data, { onSuccess });
    }
  };

  // --- Render Logic ---
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
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manajemen Produk
          </h1>
          <p className="text-muted-foreground">
            Kelola produk pupuk NPK di toko Anda
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <Select
              value={advancedFilters.productTypeId}
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Tipe</SelectItem>
                {productTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter Lanjutan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Daftar Produk ({paginatedProducts.products.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                {paginatedProducts.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <NextImage
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
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.productType?.name ?? "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInfo(product)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(product.id)}
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
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {paginatedProducts.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>
          <span className="text-sm">
            Halaman {page} dari {paginatedProducts.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === paginatedProducts.totalPages}
          >
            Berikutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onOpenChange={setIsFilterModalOpen}
        filters={advancedFilters}
        onFilterChange={(newFilters) => {
          setPage(1);
          setAdvancedFilters((prev) => ({ ...prev, ...newFilters }));
        }}
        onReset={handleResetFilters}
      />

      {/* Add/Edit Product Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </DialogTitle>
          </DialogHeader>
          {/* <ProductForm
            initialData={editingProduct}
            productTypes={productTypes}
            packagings={packagings}
            onSubmit={handleFormSubmit}
            onClose={() => setIsModalOpen(false)}
            isSubmitting={isCreating || isUpdating}
          /> */}
        </DialogContent>
      </Dialog>

      {/* Product Info Dialog */}
      <Dialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Produk</DialogTitle>
          </DialogHeader>
          {viewingProduct && (
            <div className="mt-4 space-y-6 max-h-[80vh] overflow-y-auto pr-2">
              <Card>
                <CardContent className="p-6">
                  <Typography variant="h5" weight="bold" className="mb-2">
                    {viewingProduct.name}
                  </Typography>
                  <Badge variant="secondary" className="mb-4">
                    {viewingProduct.productType?.name ?? "N/A"}
                  </Badge>
                  <p className="text-muted-foreground text-sm">
                    {viewingProduct.description}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Manfaat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {viewingProduct.benefits}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Petunjuk Penyimpanan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {viewingProduct.storageInstructions}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Petunjuk Penggunaan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {viewingProduct.usageInstructions}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Waktu Kadaluarsa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground">
                      {viewingProduct.expiredDurationInYears} tahun
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Typography variant="h6" weight="semibold" className="mb-4">
                  Varian Produk ({viewingProduct.variants.length})
                </Typography>
                <div className="space-y-4">
                  {viewingProduct.variants.map((variant) => (
                    <Card key={variant.id} className="bg-muted/50">
                      <CardContent className="p-4 flex gap-4 items-start">
                        <NextImage
                          src={variant.imageUrl ?? "/dashboard/Hero.jpg"}
                          alt={variant.composition}
                          width={100}
                          height={100}
                          className="rounded-lg"
                          imgClassName="object-cover w-full h-full"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">
                            {variant.id.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm">
                            Komposisi: {variant.composition}
                          </p>
                          <p className="text-sm">Berat: {variant.weight}</p>
                          <p className="text-sm">
                            Kemasan:{" "}
                            {packagings.find(
                              (p) => p.id === variant.packagingId,
                            )?.name ?? "N/A"}
                          </p>
                          <Separator className="my-2" />
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(variant.priceRupiah)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
