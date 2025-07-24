"use client";
import { DialogFooter } from "@/components/Dialog";
import NextImage from "@/components/NextImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Textarea } from "@/components/TextArea";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import LabelText from "@/components/form/LabelText";
import ImageCropper from "@/layouts/_container/ImageCropper";
import { CreateProductPayload, Product, ProductType } from "@/types/product";
import { Camera, Check, Edit2, Loader2, Settings, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FormProvider, UseFormReturn, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ProductTypeManager from "./ProductTypeManager";

type FormMode = "create" | "edit";
type ProductFormValues = {
  name: string;
  description: string;
  composition: string;
  productTypeId?: string;
  storageInstructions: string;
  expiredDurationInYears: number;
  usageInstructions: string;
  benefits: string;
};
type EditableField = keyof ProductFormValues | "image";

interface ProductFormProps {
  initialData: Product | null;
  productTypes: ProductType[];
  onSubmit: (formData: FormData) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const EditableFieldDisplay = ({
  fieldName,
  label,
  isTextArea = false,
  methods,
  productTypes,
  handleSaveField,
  handleCancelEdit,
  isSubmitting,
  setIsTypeManagerOpen,
}: {
  fieldName: EditableField;
  label: string;
  isTextArea?: boolean;
  methods: UseFormReturn<CreateProductPayload>;
  productTypes: ProductType[];
  handleSaveField: () => void;
  handleCancelEdit: () => void;
  isSubmitting: boolean;
  setIsTypeManagerOpen: (isOpen: boolean) => void;
}) => {
  const { register, watch, setValue, clearErrors } = methods;
  const value = watch(fieldName);
  return (
    <div className="space-y-2">
      <LabelText required>{label}</LabelText>
      <div className="flex items-center gap-2">
        <div className="flex-grow">
          {fieldName === "productTypeId" ? (
            <Select
              defaultValue={value ? String(value) : undefined}
              onValueChange={(val) => {
                setValue(fieldName, val, { shouldDirty: true });
                clearErrors(fieldName);
              }}
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
              </SelectContent>
            </Select>
          ) : isTextArea ? (
            <Textarea
              id={fieldName}
              rows={4}
              {...register(fieldName)}
              className="text-sm"
            />
          ) : (
            <Input
              id={fieldName}
              type={fieldName === "expiredDurationInYears" ? "number" : "text"}
              {...register(
                fieldName,
                fieldName === "expiredDurationInYears"
                  ? { valueAsNumber: true }
                  : {},
              )}
              className="text-sm"
            />
          )}
        </div>
        {fieldName === "productTypeId" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsTypeManagerOpen(true)}
            className="p-2 h-10"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center justify-end gap-2">
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
    </div>
  );
};

export default function ProductForm({
  initialData,
  productTypes,
  onSubmit,
  onClose,
  isSubmitting,
}: ProductFormProps) {
  const mode: FormMode = initialData ? "edit" : "create";
  const methods = useForm<CreateProductPayload>({
    mode: "onTouched",
  });
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = methods;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [isTypeManagerOpen, setIsTypeManagerOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (initialData) {
      const { imageUrl, ...formValues } = {
        ...initialData,
        productTypeId: initialData.productTypeId || initialData.productType?.id,
      };
      reset(formValues);
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
  const handleEditField = (fieldName: EditableField) => {
    setEditingField(fieldName);
  };
  const handleCancelEdit = () => {
    const formValues = {
      ...initialData,
      productTypeId: initialData?.productTypeId || initialData?.productType?.id,
    };
    reset(formValues);
    setEditingField(null);
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
      if (editingField === "expiredDurationInYears" && isNaN(Number(value))) {
        toast.error("Masa kadaluarsa harus berupa angka.");
        return;
      } else if (editingField === "expiredDurationInYears") {
        formData.append(editingField, String(Number(value)));
      } else if (editingField === "productTypeId" && !value) {
        toast.error("Tipe produk wajib dipilih.");
        return;
      } else {
        formData.append(editingField, String(value));
      }
    }
    await onSubmit(formData);
    setEditingField(null);
  };
  const onFinalSubmit = (data: ProductFormValues) => {
    if (!selectedFile) {
      toast.error("Gambar varian wajib diunggah.");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedFile);
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "image") {
        formData.append(key, String(value));
      }
    });
    onClose();
    onSubmit(formData);
  };
  const renderField = (
    fieldName: EditableField,
    label: string,
    isTextArea = false,
  ) => {
    const value = watch(fieldName);
    const productType =
      fieldName === "productTypeId"
        ? productTypes.find((pt) => pt.id === value)
        : null;
    if (editingField === fieldName) {
      return (
        <EditableFieldDisplay
          fieldName={fieldName}
          label={label}
          isTextArea={isTextArea}
          methods={methods}
          productTypes={productTypes}
          handleSaveField={handleSaveField}
          handleCancelEdit={handleCancelEdit}
          isSubmitting={isSubmitting}
          setIsTypeManagerOpen={setIsTypeManagerOpen}
        />
      );
    }
    return (
      <div className="space-y-1 group">
        <LabelText>{label}</LabelText>
        <div className="flex items-start justify-between">
          <Typography variant="p" className="text-foreground pr-4">
            {fieldName === "productTypeId"
              ? productType?.name || "Belum diatur"
              : value}
            {fieldName === "expiredDurationInYears" && " tahun"}
          </Typography>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleEditField(fieldName)}
            className="p-1 h-auto opacity-0 group-hover:opacity-100"
          >
            <Edit2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
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

        <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6">
          {/* Kontainer Utama dengan Grid 2 Kolom */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            {/* KOLOM KIRI: Upload Gambar */}
            <div className="space-y-4">
              <div className="space-y-2">
                <LabelText required>Gambar Varian (16:9)</LabelText>
                <div
                  className="group relative flex h-fit w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed bg-muted aspect-video"
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
                      className="h-full w-full rounded-lg"
                      imgClassName="object-cover"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Camera className="mx-auto h-12 w-12" />
                      <p>Klik untuk memilih gambar</p>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
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
              <Input
                id="name"
                label="Nama Produk"
                validation={{ required: "Nama produk tidak boleh kosong" }}
              />
            </div>
            {/* KOLOM KANAN: Semua Form Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <LabelText required>Tipe Produk</LabelText>
                <div className="flex items-center gap-2">
                  <Select
                    onValueChange={(value) => {
                      setValue("productTypeId", value);
                      clearErrors("productTypeId");
                    }}
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
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 p-2"
                    onClick={() => setIsTypeManagerOpen(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
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
          </div>

          {/* Bagian Input Lanjutan di Bawah Grid Utama */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <LabelText required>Komposisi</LabelText>
              <Textarea
                id="composition"
                rows={3}
                {...register("composition", {
                  required: "Komposisi tidak boleh kosong",
                })}
              />
            </div>
            <div className="space-y-2">
              <LabelText required>Manfaat & Keunggulan</LabelText>
              <Textarea
                id="benefits"
                rows={3}
                {...register("benefits", {
                  required: "Manfaat tidak boleh kosong",
                })}
              />
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
              Simpan
            </Button>
          </DialogFooter>
        </form>

        <ProductTypeManager
          isOpen={isTypeManagerOpen}
          onClose={() => setIsTypeManagerOpen(false)}
          productTypes={productTypes}
        />
      </FormProvider>
    );
  }
  // --- EDIT MODE ---
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
        <div className="grid max-h-[60vh] grid-cols-1 gap-x-6 gap-y-4 overflow-y-auto p-1 md:grid-cols-2">
          {/* Kolom Kiri: Gambar */}
          <div className="group space-y-4">
            <div className="space-y-2">
              <LabelText>Gambar Varian (16:9)</LabelText>
              <div className="relative w-full rounded-lg bg-muted aspect-video">
                <NextImage
                  src={previewUrl || "/dashboard/Hero.jpg"}
                  alt="Variant preview"
                  width={1920}
                  height={1080}
                  className="h-full w-full rounded-lg"
                  imgClassName="h-full w-full object-cover"
                />
                <div
                  role="button"
                  tabIndex={0}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={handleFileSelect}
                  onKeyDown={(e) => e.key === "Enter" && handleFileSelect()}
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
                <div className="mt-2 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveField}
                    disabled={isSubmitting || !selectedFile}
                    className="h-auto p-1"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-auto p-1"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              )}
            </div>
            {renderField("name", "Nama Produk")}
            {renderField("productTypeId", "Tipe Produk")}
          </div>

          {/* Kolom Kanan: Detail Produk */}
          <div className="space-y-4">
            {renderField("composition", "Komposisi")}
            {renderField("description", "Deskripsi", true)}
            {renderField("expiredDurationInYears", "Masa Kadaluarsa")}
            {renderField("benefits", "Manfaat & Keunggulan", true)}
            {renderField("usageInstructions", "Petunjuk Penggunaan", true)}
            {renderField("storageInstructions", "Petunjuk Penyimpanan", true)}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </div>

      <ProductTypeManager
        isOpen={isTypeManagerOpen}
        onClose={() => setIsTypeManagerOpen(false)}
        productTypes={productTypes}
      />
    </FormProvider>
  );
}
