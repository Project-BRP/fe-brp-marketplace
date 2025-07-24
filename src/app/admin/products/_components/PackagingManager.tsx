// src/app/admin/products/_components/PackagingManager.tsx
"use client";

import { Check, Edit2, Loader2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  useCreatePackaging,
  useDeletePackaging,
  useUpdatePackaging,
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
import { Packaging } from "@/types/product";

interface PackagingManagerProps {
  isOpen: boolean;
  onClose: () => void;
  packagings: Packaging[];
}

export default function PackagingManager({
  isOpen,
  onClose,
  packagings,
}: PackagingManagerProps) {
  const [newPackagingName, setNewPackagingName] = useState("");
  const [editingPackagingId, setEditingPackagingId] = useState<string | null>(
    null,
  );
  const [editingPackagingName, setEditingPackagingName] = useState("");

  const { mutate: createPackaging, isPending: isCreating } =
    useCreatePackaging();
  const { mutate: updatePackaging, isPending: isUpdating } =
    useUpdatePackaging();
  const { mutate: deletePackaging, isPending: isDeleting } =
    useDeletePackaging();

  const handleAddNewPackaging = () => {
    if (newPackagingName.trim() === "") {
      toast.error("Nama kemasan tidak boleh kosong.");
      return;
    }
    createPackaging(
      { name: newPackagingName },
      { onSuccess: () => setNewPackagingName("") },
    );
  };

  const handleEdit = (pkg: Packaging) => {
    setEditingPackagingId(pkg.id);
    setEditingPackagingName(pkg.name);
  };

  const handleCancelEdit = () => {
    setEditingPackagingId(null);
    setEditingPackagingName("");
  };

  const handleSaveEdit = () => {
    if (!editingPackagingId || editingPackagingName.trim() === "") {
      toast.error("Nama kemasan tidak boleh kosong.");
      return;
    }
    updatePackaging(
      { id: editingPackagingId, payload: { name: editingPackagingName } },
      { onSuccess: handleCancelEdit },
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kemasan ini?")) {
      deletePackaging(id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kelola Tipe Kemasan</DialogTitle>
          <DialogDescription>
            Tambah, edit, atau hapus tipe kemasan yang tersedia.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              id="new-packaging"
              placeholder="Nama Kemasan Baru"
              value={newPackagingName}
              onChange={(e) => setNewPackagingName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNewPackaging()}
              className="flex-grow"
            />
            <Button onClick={handleAddNewPackaging} disabled={isCreating}>
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
            {packagings.map((pkg) => (
              <div
                key={pkg.id}
                className="flex items-center justify-between rounded-md bg-muted p-2"
              >
                {editingPackagingId === pkg.id ? (
                  <Input
                    id={`edit-${pkg.id}`}
                    value={editingPackagingName}
                    onChange={(e) => setEditingPackagingName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                    className="h-8 flex-grow"
                  />
                ) : (
                  <span className="text-sm">{pkg.name}</span>
                )}
                <div className="flex items-center gap-1">
                  {editingPackagingId === pkg.id ? (
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
                        onClick={() => handleEdit(pkg)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(pkg.id)}
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
