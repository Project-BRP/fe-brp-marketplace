"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useCreateProductType } from "@/app/admin/hooks/useAdminProduct";
import { DialogFooter } from "@/components/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Textarea } from "@/components/TextArea";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import LabelText from "@/components/form/LabelText";
import { CreateProductPayload, Product, ProductType } from "@/types/product";

interface ProductFormProps {
  initialData: Product | null;
  productTypes: ProductType[];
  onSubmit: (data: CreateProductPayload) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export default function ProductForm({
  initialData,
  productTypes,
  onSubmit,
  onClose,
  isSubmitting,
}: ProductFormProps) {
  const methods = useForm<CreateProductPayload>({
    mode: "onTouched",
  });
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const [showNewTypeInput, setShowNewTypeInput] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const { mutateAsync: createProductType, isPending: isCreatingType } =
    useCreateProductType();

  const productTypeId = watch("productTypeId");

  useEffect(() => {
    if (initialData) {
      const dataToReset = {
        ...initialData,
        expiredDurationInYears: initialData.expiredDurationInYears || 0,
        variants: initialData.variants || [],
      };
      reset(dataToReset);
    } else {
      reset({
        name: "",
        description: "",
        productTypeId: "",
        storageInstructions: "",
        expiredDurationInYears: 0,
        usageInstructions: "",
        benefits: "",
      });
    }
  }, [initialData, reset]);

  const handleTypeChange = (value: string) => {
    if (value === "new-type") {
      setShowNewTypeInput(true);
      setValue("productTypeId", "");
    } else {
      setShowNewTypeInput(false);
      setValue("productTypeId", value);
    }
  };

  const onFormSubmit = async (data: CreateProductPayload) => {
    let finalProductTypeId = data.productTypeId;

    if (showNewTypeInput && newTypeName.trim()) {
      try {
        const response = await createProductType({ name: newTypeName });
        finalProductTypeId = response.data.id;
      } catch (error) {
        console.error("Gagal membuat tipe produk baru:", error);
        return; // Hentikan submit jika pembuatan tipe gagal
      }
    }

    if (!finalProductTypeId) {
      methods.setError("productTypeId", {
        type: "manual",
        message: "Tipe produk wajib diisi.",
      });
      return;
    }

    const payload: CreateProductPayload = {
      ...data,
      productTypeId: finalProductTypeId,
      expiredDurationInYears: Number(data.expiredDurationInYears),
    };
    onSubmit(payload);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
          {/* Kolom Kiri */}
          <div className="space-y-4">
            <Input
              id="name"
              label="Nama Produk"
              validation={{ required: "Nama produk tidak boleh kosong" }}
            />
            <div className="space-y-2">
              <LabelText required>Tipe Produk</LabelText>
              <Select
                value={showNewTypeInput ? "new-type" : productTypeId}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe produk" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new-type">
                    <span className="text-primary font-semibold">
                      + Buat Tipe Baru
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              {showNewTypeInput && (
                <Input
                  id="newTypeName"
                  placeholder="Nama Tipe Baru"
                  className="mt-2"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                />
              )}
              {errors.productTypeId && (
                <p className="text-sm text-red-500">
                  {errors.productTypeId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <LabelText required>Deskripsi</LabelText>
              <Textarea
                id="description"
                rows={5}
                {...register("description", {
                  required: "Deskripsi tidak boleh kosong",
                })}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <Input
              id="expiredDurationInYears"
              label="Masa Kadaluarsa (Tahun)"
              type="number"
              validation={{
                required: "Masa kadaluarsa tidak boleh kosong",
                valueAsNumber: true,
              }}
            />
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-4">
            <div className="space-y-2">
              <LabelText required>Manfaat & Keunggulan</LabelText>
              <Textarea
                id="benefits"
                rows={3}
                {...register("benefits", {
                  required: "Manfaat tidak boleh kosong",
                })}
              />
              {errors.benefits && (
                <p className="text-sm text-red-500">
                  {errors.benefits.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <LabelText required>Petunjuk Penggunaan</LabelText>
              <Textarea
                id="usageInstructions"
                rows={3}
                {...register("usageInstructions", {
                  required: "Petunjuk penggunaan tidak boleh kosong",
                })}
              />
              {errors.usageInstructions && (
                <p className="text-sm text-red-500">
                  {errors.usageInstructions.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <LabelText required>Petunjuk Penyimpanan</LabelText>
              <Textarea
                id="storageInstructions"
                rows={3}
                {...register("storageInstructions", {
                  required: "Petunjuk penyimpanan tidak boleh kosong",
                })}
              />
              {errors.storageInstructions && (
                <p className="text-sm text-red-500">
                  {errors.storageInstructions.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isCreatingType}
            variant="green"
          >
            {(isSubmitting || isCreatingType) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Simpan
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
