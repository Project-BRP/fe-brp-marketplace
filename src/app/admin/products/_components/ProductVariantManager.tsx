// src/app/admin/products/_components/ProductVariantManager.tsx
"use client";

import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  useCreateProductVariant,
  useDeleteProductVariant,
  useUpdateProductVariant,
} from "@/app/admin/hooks/useAdminProduct";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import { Packaging, Product, ProductVariant } from "@/types/product";
import ProductVariantForm from "./ProductVariantForm";

interface ProductVariantManagerProps {
  product: Product;
  packagings: Packaging[];
  onUpdate: () => void; // Callback to trigger refetch in parent
}

export default function ProductVariantManager({
  product,
  packagings,
  onUpdate,
}: ProductVariantManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null,
  );

  // Pass productId to hooks
  const { mutateAsync: createVariant, isPending: isCreating } =
    useCreateProductVariant(product.id);
  const { mutateAsync: updateVariant, isPending: isUpdating } =
    useUpdateProductVariant();
  const { mutate: deleteVariant, isPending: isDeleting } =
    useDeleteProductVariant();

  const handleAdd = () => {
    setEditingVariant(null);
    setIsModalOpen(true);
  };

  const handleEdit = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setIsModalOpen(true);
  };

  const handleDelete = (variantId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus varian ini?")) {
      deleteVariant(variantId, {
        onSuccess: () => onUpdate(),
      });
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (editingVariant) {
      await updateVariant({ variantId: editingVariant.id, payload: formData });
    } else {
      await createVariant(formData);
    }
    setIsModalOpen(false);
    onUpdate(); // Call parent's update function
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h6" weight="semibold">
          Varian Produk ({product.variants?.length || 0})
        </Typography>
        <Button
          onClick={handleAdd}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Varian
        </Button>
      </div>
      <div className="space-y-4">
        {product.variants?.map((variant) => (
          <div
            key={variant.id}
            className="bg-muted/50 p-4 rounded-lg flex gap-4 items-start"
          >
            <NextImage
              src={process.env.NEXT_PUBLIC_IMAGE_URL + variant.imageUrl}
              alt={variant.id}
              width={100}
              height={56}
              className="rounded-lg w-[100px] h-auto aspect-video flex-shrink-0"
              imgClassName="object-cover w-full h-full"
            />
            <div className="flex-1">
              <p className="text-sm">Stok: {variant.stock}</p>
              <p className="text-sm">Berat: {variant.weight_in_kg} kg</p>
              <p className="text-sm">
                Kemasan:{" "}
                {packagings.find((p) => p.id === variant.packagingId)?.name ??
                  "N/A"}
              </p>
              <p className="text-lg font-bold text-primary mt-2">
                {formatPrice(variant.priceRupiah)}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(variant)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(variant.id)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
        {(!product.variants || product.variants.length === 0) && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Belum ada varian untuk produk ini.
          </p>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingVariant ? "Edit Varian Produk" : "Tambah Varian Baru"}
            </DialogTitle>
          </DialogHeader>
          <ProductVariantForm
            initialData={editingVariant}
            onSubmit={handleFormSubmit}
            onClose={() => setIsModalOpen(false)}
            isSubmitting={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
