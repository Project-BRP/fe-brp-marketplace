// src/app/admin/products/_components/ProductVariantForm.tsx
"use client";

import { Camera, Check, Edit2, Loader2, Settings, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { usePackagings } from "@/app/admin/hooks/useMeta";
import { DialogFooter } from "@/components/Dialog";
import NextImage from "@/components/NextImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import LabelText from "@/components/form/LabelText";
import ImageCropper from "@/layouts/_container/ImageCropper";
import { ProductVariant } from "@/types/product";
import PackagingManager from "./PackagingManager";

type VariantFormValues = {
  weight_in_kg: number;
  priceRupiah: number;
  packagingId: string;
};
type EditableField = keyof VariantFormValues | "image";

interface ProductVariantFormProps {
  initialData: ProductVariant | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export default function ProductVariantForm({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
}: ProductVariantFormProps) {
  const mode = initialData ? "edit" : "create";
  const methods = useForm<VariantFormValues>({ mode: "onTouched" });
  const { handleSubmit, register, reset, control, watch } = methods;
  const { errors } = methods.formState;
  methods;

  const { data: packagings = [], isLoading: isLoadingPackagings } =
    usePackagings();
  const [isPackagingManagerOpen, setIsPackagingManagerOpen] = useState(false);
  const [editingField, setEditingField] = useState<EditableField | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      reset({
        weight_in_kg: initialData.weight_in_kg,
        priceRupiah: initialData.priceRupiah,
        packagingId: initialData.packagingId || undefined,
      });
      if (initialData.imageUrl) {
        setPreviewUrl(process.env.NEXT_PUBLIC_IMAGE_URL + initialData.imageUrl);
      }
    } else {
      reset();
    }
  }, [initialData, reset]);

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImageToCrop(reader.result as string);
      reader.readAsDataURL(file);
      event.target.value = "";
    }
  };

  const handleCrop = (croppedImage: Blob) => {
    const file = new File([croppedImage], "variant-image.jpeg", {
      type: "image/jpeg",
    });
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageToCrop(null);
    if (mode === "edit") {
      setEditingField("image");
    }
  };

  const handleSaveField = async () => {
    if (!editingField) return;

    const formData = new FormData();
    if (editingField === "image") {
      if (selectedFile) {
        formData.append("image", selectedFile);
      } else {
        toast.error("Tidak ada gambar baru yang dipilih.");
        return;
      }
    } else {
      const value = watch(editingField);
      if (value === undefined || value === null || value === "") {
        toast.error("Nilai tidak boleh kosong.");
        return;
      }
      formData.append(editingField, String(value));
    }

    await onSubmit(formData);
    setEditingField(null);
    setSelectedFile(null);
  };

  const handleCancelEdit = () => {
    if (initialData)
      reset({
        weight_in_kg: initialData.weight_in_kg,
        priceRupiah: initialData.priceRupiah,
        packagingId: initialData.packagingId || undefined,
      });
    setEditingField(null);
    setPreviewUrl(
      initialData?.imageUrl
        ? process.env.NEXT_PUBLIC_IMAGE_URL + initialData.imageUrl
        : null,
    );
    setSelectedFile(null);
  };

  const onFinalSubmitCreate = async (data: VariantFormValues) => {
    if (!selectedFile) {
      toast.error("Gambar varian wajib diunggah.");
      return;
    }
    const formData = new FormData();
    formData.append("weight_in_kg", String(data.weight_in_kg));
    formData.append("priceRupiah", String(data.priceRupiah));
    formData.append("packagingId", data.packagingId);
    formData.append("image", selectedFile);
    await onSubmit(formData);
  };

  const renderField = (fieldName: EditableField, label: string) => {
    const value = watch(fieldName as keyof VariantFormValues);
    const displayValue =
      fieldName === "packagingId"
        ? packagings.find((p) => p.id === value)?.name
        : value;

    return (
      <div className="space-y-1 group">
        <LabelText>{label}</LabelText>
        {editingField === fieldName ? (
          <div className="flex items-center gap-2">
            {fieldName === "packagingId" ? (
              <div className="flex items-center gap-2 w-full">
                <Controller
                  name="packagingId"
                  control={control}
                  rules={{ required: "Kemasan harus dipilih" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kemasan" />
                      </SelectTrigger>
                      <SelectContent>
                        {packagings.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            {pkg.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="p-2 h-10"
                  onClick={() => setIsPackagingManagerOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Input
                id={fieldName}
                type="number"
                {...register(fieldName as keyof VariantFormValues, {
                  valueAsNumber: true,
                })}
              />
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSaveField}
              disabled={isSubmitting}
              className="p-1 h-auto"
            >
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              className="p-1 h-auto"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <Typography variant="p" className="text-foreground pr-4">
              {displayValue || "Belum diatur"}
            </Typography>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditingField(fieldName)}
              className="p-1 h-auto opacity-0 group-hover:opacity-100"
            >
              <Edit2 className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (mode === "create") {
    return (
      <FormProvider {...methods}>
        {imageToCrop && (
          <ImageCropper
            imageSrc={imageToCrop}
            onCrop={handleCrop}
            onClose={() => setImageToCrop(null)}
            aspect={16 / 9}
            circularCrop={false}
          />
        )}
        <form
          onSubmit={handleSubmit(onFinalSubmitCreate)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto p-1">
            <div className="space-y-2">
              <LabelText required>Gambar Varian (16:9)</LabelText>
              <div
                className="relative w-full aspect-video bg-muted rounded-lg group flex items-center justify-center cursor-pointer border-2 border-dashed"
                onClick={handleFileSelect}
                onKeyDown={(e) => e.key === "Enter" && handleFileSelect()}
                role="button"
                tabIndex={0}
              >
                {previewUrl ? (
                  <NextImage
                    src={previewUrl}
                    alt="Variant preview"
                    width={1920}
                    height={1080}
                    className="rounded-lg w-full h-full"
                    imgClassName="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Camera className="mx-auto h-12 w-12" />
                    <p>Klik untuk memilih gambar</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg"
              />
            </div>

            <div className="space-y-4">
              <Input
                id="weight_in_kg"
                label="Berat (kg)"
                type="number"
                validation={{
                  required: "Berat tidak boleh kosong",
                  valueAsNumber: true,
                  min: { value: 0, message: "Berat tidak boleh negatif" },
                }}
              />
              <Input
                id="priceRupiah"
                label="Harga (Rp)"
                type="number"
                validation={{
                  required: "Harga tidak boleh kosong",
                  valueAsNumber: true,
                  min: { value: 0, message: "Harga tidak boleh negatif" },
                }}
              />
              <div className="space-y-2">
                <LabelText required>Kemasan</LabelText>
                <div className="flex items-center gap-2">
                  <Controller
                    name="packagingId"
                    control={control}
                    rules={{ required: "Kemasan harus dipilih" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe kemasan" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingPackagings ? (
                            <SelectItem value="loading" disabled>
                              Memuat...
                            </SelectItem>
                          ) : (
                            packagings.map((pkg) => (
                              <SelectItem key={pkg.id} value={pkg.id}>
                                {pkg.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="p-2 h-10"
                    onClick={() => setIsPackagingManagerOpen(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                {errors.packagingId && (
                  <p className="text-sm text-red-500">
                    {errors.packagingId.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="green">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Tambah Varian
            </Button>
          </DialogFooter>
        </form>
        <PackagingManager
          isOpen={isPackagingManagerOpen}
          onClose={() => setIsPackagingManagerOpen(false)}
          packagings={packagings}
        />
      </FormProvider>
    );
  }

  return (
    <FormProvider {...methods}>
      {imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCrop={handleCrop}
          onClose={() => setImageToCrop(null)}
          aspect={16 / 9}
          circularCrop={false}
        />
      )}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto p-1">
          <div className="space-y-2 group">
            <LabelText>Gambar Varian (16:9)</LabelText>
            <div className="relative w-full aspect-video bg-muted rounded-lg">
              <NextImage
                src={previewUrl || "/dashboard/Hero.jpg"}
                alt="Variant preview"
                width={1920}
                height={1080}
                className="rounded-lg w-full h-full"
                imgClassName="object-cover w-full h-full"
              />
              <div
                className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleFileSelect}
                onKeyDown={(e) => e.key === "Enter" && handleFileSelect()}
                role="button"
                tabIndex={0}
              >
                <Edit2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg"
            />
            {editingField === "image" && (
              <div className="flex items-center justify-end gap-2 mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveField}
                  disabled={isSubmitting || !selectedFile}
                  className="p-1 h-auto"
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="p-1 h-auto"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {renderField("weight_in_kg", "Berat (kg)")}
            {renderField("priceRupiah", "Harga (Rp)")}
            {renderField("packagingId", "Kemasan")}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </div>
      <PackagingManager
        isOpen={isPackagingManagerOpen}
        onClose={() => setIsPackagingManagerOpen(false)}
        packagings={packagings}
      />
    </FormProvider>
  );
}
