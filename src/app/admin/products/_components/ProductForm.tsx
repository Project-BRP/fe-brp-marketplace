"use client";

import { Check, Edit2, Loader2, Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, UseFormReturn, useForm } from "react-hook-form";

import { DialogFooter } from "@/components/Dialog";
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
import {
  CreateProductPayload,
  Product,
  ProductType,
  UpdateProductPayload,
} from "@/types/product";
import ProductTypeManager from "./ProductTypeManager";

type FormMode = "create" | "edit";
type EditableField = keyof UpdateProductPayload;

interface ProductFormProps {
  initialData: Product | null;
  productTypes: ProductType[];
  onSubmit: (data: CreateProductPayload | UpdateProductPayload) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

// Komponen dipindahkan ke luar untuk mencegah re-render yang tidak perlu
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

  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [isTypeManagerOpen, setIsTypeManagerOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      // FIX: Memastikan productTypeId di-set dengan benar dari data awal
      const formValues = {
        ...initialData,
        productTypeId: initialData.productTypeId || initialData.productType?.id,
      };
      reset(formValues);
    } else {
      reset({
        name: "",
        description: "",
        productTypeId: undefined,
        storageInstructions: "",
        expiredDurationInYears: 0,
        usageInstructions: "",
        benefits: "",
      });
    }
  }, [initialData, reset]);

  const handleEditField = (fieldName: EditableField) => {
    setEditingField(fieldName);
  };

  const handleCancelEdit = () => {
    // FIX: Reset ke nilai awal yang benar saat membatalkan
    const formValues = {
      ...initialData,
      productTypeId: initialData?.productTypeId || initialData?.productType?.id,
    };
    reset(formValues);
    setEditingField(null);
  };

  const handleSaveField = async () => {
    if (!editingField) return;

    const value = watch(editingField);
    let finalValue: string | number | undefined = value;

    if (editingField === "expiredDurationInYears") {
      finalValue = Number(value);
    }

    const payload: UpdateProductPayload = { [editingField]: finalValue };

    if (editingField === "productTypeId" && !value) {
      methods.setError("productTypeId", {
        type: "manual",
        message: "Tipe produk wajib dipilih.",
      });
      return;
    }

    await onSubmit(payload);
    setEditingField(null);
  };

  const onFinalSubmit = (data: CreateProductPayload) => {
    const payload = {
      ...data,
      expiredDurationInYears: Number(data.expiredDurationInYears),
      variants: [],
    };
    onSubmit(payload);
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
            {/* FIX: Menampilkan nama tipe produk, bukan ID */}
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
    // --- CREATE MODE ---
    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
            <div className="space-y-4">
              <Input
                id="name"
                label="Nama Produk"
                validation={{ required: "Nama produk tidak boleh kosong" }}
              />
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
                    className="p-2 h-10"
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
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[60vh] overflow-y-auto p-1">
          {renderField("name", "Nama Produk")}
          {renderField("productTypeId", "Tipe Produk")}
          {renderField("description", "Deskripsi", true)}
          {renderField("expiredDurationInYears", "Masa Kadaluarsa")}
          {renderField("benefits", "Manfaat & Keunggulan", true)}
          {renderField("usageInstructions", "Petunjuk Penggunaan", true)}
          {renderField("storageInstructions", "Petunjuk Penyimpanan", true)}
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
