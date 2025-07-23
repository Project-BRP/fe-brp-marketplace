"use client";

import { Check, Edit2, Loader2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  useCreateProductType,
  useDeleteProductType,
  useUpdateProductType,
} from "@/app/admin/hooks/useAdminProduct";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import { ProductType } from "@/types/product";

interface ProductTypeManagerProps {
  isOpen: boolean;
  onClose: () => void;
  productTypes: ProductType[];
}

export default function ProductTypeManager({
  isOpen,
  onClose,
  productTypes,
}: ProductTypeManagerProps) {
  const [newTypeName, setNewTypeName] = useState("");
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [editingTypeName, setEditingTypeName] = useState("");

  const { mutate: createType, isPending: isCreating } = useCreateProductType();
  const { mutate: updateType, isPending: isUpdating } = useUpdateProductType();
  const { mutate: deleteType, isPending: isDeleting } = useDeleteProductType();

  const handleAddNewType = () => {
    if (newTypeName.trim() === "") {
      toast.error("Nama tipe tidak boleh kosong.");
      return;
    }
    createType({ name: newTypeName }, { onSuccess: () => setNewTypeName("") });
  };

  const handleEdit = (type: ProductType) => {
    setEditingTypeId(type.id);
    setEditingTypeName(type.name);
  };

  const handleCancelEdit = () => {
    setEditingTypeId(null);
    setEditingTypeName("");
  };

  const handleSaveEdit = () => {
    if (!editingTypeId || editingTypeName.trim() === "") {
      toast.error("Nama tipe tidak boleh kosong.");
      return;
    }
    updateType(
      { id: editingTypeId, payload: { name: editingTypeName } },
      { onSuccess: handleCancelEdit },
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus tipe produk ini?")) {
      deleteType(id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kelola Tipe Produk</DialogTitle>
          <DialogDescription>
            Tambah, edit, atau hapus tipe produk yang tersedia.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Form Tambah Tipe Baru */}
          <div className="flex items-center gap-2">
            <Input
              id="new-type"
              placeholder="Nama Tipe Produk Baru"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNewType()}
              className="flex-grow"
            />
            <Button onClick={handleAddNewType} disabled={isCreating}>
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Daftar Tipe Produk */}
          <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
            {productTypes.map((type) => (
              <div
                key={type.id}
                className="flex items-center justify-between rounded-md bg-muted p-2"
              >
                {editingTypeId === type.id ? (
                  <Input
                    id={`edit-${type.id}`}
                    value={editingTypeName}
                    onChange={(e) => setEditingTypeName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                    className="h-8 flex-grow"
                  />
                ) : (
                  <span className="text-sm">{type.name}</span>
                )}
                <div className="flex items-center gap-1">
                  {editingTypeId === type.id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={handleSaveEdit}
                        disabled={isUpdating}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleEdit(type)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(type.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
