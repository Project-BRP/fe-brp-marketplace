"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Loader2, MapPin } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import {
  useGetCities,
  useGetDistricts,
  useGetProvinces,
  useGetSubDistricts,
} from "@/app/(main)/hooks/useShipping";
import {
  useCreateCompanyInfo,
  useUpdateCompanyInfo,
} from "@/app/admin/settings/hooks/useMutateCompany";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
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
import ErrorMessage from "@/components/form/ErrorMessage";
import Input from "@/components/form/Input";
import LabelText from "@/components/form/LabelText";
import { REG_PHONE_NUMBER } from "@/constants/regex";
import { CompanyInfo } from "@/types/companyInfo";

// Define the validation schema according to the payload requirements.
const companyInfoSchema = z.object({
  companyName: z.string().min(1, "Nama perusahaan harus diisi"),
  email: z.string().email("Format email tidak valid"),
  phoneNumber: z
    .string()
    .min(1, "Nomor telepon harus diisi")
    .regex(REG_PHONE_NUMBER, "Format nomor telepon tidak valid"),
  fullAddress: z.string().min(1, "Alamat lengkap harus diisi"),
  provinceId: z.string().min(1, "Provinsi harus dipilih"),
  cityId: z.string().min(1, "Kota/Kabupaten harus dipilih"),
  districtId: z.string().min(1, "Kecamatan harus dipilih"),
  subDistrictId: z.string().min(1, "Kelurahan/Desa harus dipilih"),
  npwp: z.string().min(1, "NPWP harus diisi"),
});

type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;

interface CompanyInfoFormProps {
  // Pre-existing company data for editing, or null for creation.
  companyData?: CompanyInfo | null;
  // Callback to exit the form/editing mode.
  onCancel?: () => void;
}

/**
 * A form component for creating or updating company information.
 * It handles form state, validation, and submission for company details and address.
 */
export default function CompanyInfoForm({
  companyData,
  onCancel,
}: CompanyInfoFormProps) {
  const isEditMode = !!companyData;

  const methods = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      companyName: companyData?.companyName || "",
      email: companyData?.email || "",
      phoneNumber: companyData?.phoneNumber || "",
      fullAddress: companyData?.fullAddress || "",
      provinceId: companyData?.provinceId ? String(companyData.provinceId) : "",
      cityId: companyData?.cityId ? String(companyData.cityId) : "",
      districtId: companyData?.districtId ? String(companyData.districtId) : "",
      subDistrictId: companyData?.subDistrictId
        ? String(companyData.subDistrictId)
        : "",
    },
  });

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  // Watch for changes in address fields to fetch dependent data.
  const watchedProvinceId = watch("provinceId");
  const watchedCityId = watch("cityId");
  const watchedDistrictId = watch("districtId");

  // Fetch address data using custom hooks.
  const { data: provinces, isLoading: isProvincesLoading } = useGetProvinces();
  const { data: cities, isLoading: isCitiesLoading } =
    useGetCities(watchedProvinceId);
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistricts(
    watchedProvinceId,
    watchedCityId,
  );
  const { data: subdistricts, isLoading: isSubdistrictsLoading } =
    useGetSubDistricts(watchedProvinceId, watchedCityId, watchedDistrictId);

  // Reset city, district, and subdistrict when province changes.
  useEffect(() => {
    if (
      !isEditMode ||
      (companyData && Number(watchedProvinceId) !== companyData.provinceId)
    ) {
      setValue("cityId", "");
      setValue("districtId", "");
      setValue("subDistrictId", "");
    }
  }, [watchedProvinceId, setValue, isEditMode, companyData]);

  // Reset district and subdistrict when city changes.
  useEffect(() => {
    if (
      !isEditMode ||
      (companyData && Number(watchedCityId) !== companyData.cityId)
    ) {
      setValue("districtId", "");
      setValue("subDistrictId", "");
    }
  }, [watchedCityId, setValue, isEditMode, companyData]);

  // Reset subdistrict when district changes.
  useEffect(() => {
    if (
      !isEditMode ||
      (companyData && Number(watchedDistrictId) !== companyData.districtId)
    ) {
      setValue("subDistrictId", "");
    }
  }, [watchedDistrictId, setValue, isEditMode, companyData]);

  const { mutate: createCompanyInfo, isPending: isCreating } =
    useCreateCompanyInfo();
  const { mutate: updateCompanyInfo, isPending: isUpdating } =
    useUpdateCompanyInfo();

  const onSubmit = (data: CompanyInfoFormValues) => {
    // Construct the payload to match the CompanyInfoPayload interface exactly.
    const payload = {
      companyName: data.companyName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      fullAddress: data.fullAddress,
      province: Number(data.provinceId),
      city: Number(data.cityId),
      district: Number(data.districtId),
      subDistrict: Number(data.subDistrictId),
      npwp: data.npwp,
    };

    if (isEditMode) {
      updateCompanyInfo(payload, {
        onSuccess: () => {
          onCancel?.();
        },
      });
    } else {
      createCompanyInfo(payload, {
        onSuccess: () => {
          reset();
          onCancel?.();
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Company Profile Card */}
          {!isEditMode && (
            <Card className="border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-primary" />
                  <Typography variant="h6" className="font-bold">
                    Profil Perusahaan
                  </Typography>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <LabelText>Nama Perusahaan</LabelText>
                  <Input
                    {...register("companyName")}
                    id="companyName"
                    placeholder="Masukkan nama perusahaan"
                  />
                  <ErrorMessage>
                    {errors.companyName?.message || ""}
                  </ErrorMessage>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <LabelText>Email</LabelText>
                    <Input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="contoh@email.com"
                    />
                    <ErrorMessage>{errors.email?.message || ""}</ErrorMessage>
                  </div>
                  <div>
                    <LabelText>Nomor Telepon</LabelText>
                    <Input
                      {...register("phoneNumber")}
                      id="phoneNumber"
                      type="tel"
                      placeholder="081234567890"
                    />
                    <ErrorMessage>
                      {errors.phoneNumber?.message || ""}
                    </ErrorMessage>
                  </div>
                  <div>
                    <LabelText>NPWP</LabelText>
                    <Input
                      {...register("npwp")}
                      id="npwp"
                      placeholder="Masukkan NPWP"
                    />
                    <ErrorMessage>{errors.npwp?.message || ""}</ErrorMessage>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Shipping Address Card */}
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <Typography variant="h6" className="font-bold">
                  Alamat Perusahaan
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <LabelText>Alamat Lengkap</LabelText>
                <Textarea
                  {...register("fullAddress")}
                  id="fullAddress"
                  placeholder="Contoh: Jl. Pahlawan No. 10, RT 01/RW 02"
                />
                <ErrorMessage>{errors.fullAddress?.message || ""}</ErrorMessage>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Province */}
                <div>
                  <LabelText>Provinsi</LabelText>
                  <Select
                    onValueChange={(value) => setValue("provinceId", value)}
                    value={watchedProvinceId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isProvincesLoading ? "Memuat..." : "Pilih Provinsi"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces?.map((province) => (
                        <SelectItem
                          key={province.id}
                          value={String(province.id)}
                        >
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage>
                    {errors.provinceId?.message || ""}
                  </ErrorMessage>
                </div>

                {/* City */}
                <div>
                  <LabelText>Kota/Kabupaten</LabelText>
                  <Select
                    onValueChange={(value) => setValue("cityId", value)}
                    value={watchedCityId}
                    disabled={!watchedProvinceId || isCitiesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isCitiesLoading ? "Memuat..." : "Pilih Kota/Kabupaten"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city) => (
                        <SelectItem key={city.id} value={String(city.id)}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage>{errors.cityId?.message || ""}</ErrorMessage>
                </div>

                {/* District */}
                <div>
                  <LabelText>Kecamatan</LabelText>
                  <Select
                    onValueChange={(value) => setValue("districtId", value)}
                    value={watchedDistrictId}
                    disabled={!watchedCityId || isDistrictsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isDistrictsLoading ? "Memuat..." : "Pilih Kecamatan"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {districts?.map((district) => (
                        <SelectItem
                          key={district.id}
                          value={String(district.id)}
                        >
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage>
                    {errors.districtId?.message || ""}
                  </ErrorMessage>
                </div>

                {/* Subdistrict */}
                <div>
                  <LabelText>Kelurahan/Desa</LabelText>
                  <Select
                    onValueChange={(value) => setValue("subDistrictId", value)}
                    value={watch("subDistrictId")}
                    disabled={!watchedDistrictId || isSubdistrictsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isSubdistrictsLoading
                            ? "Memuat..."
                            : "Pilih Kelurahan/Desa"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subdistricts?.map((subdistrict) => (
                        <SelectItem
                          key={subdistrict.id}
                          value={String(subdistrict.id)}
                        >
                          {subdistrict.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage>
                    {errors.subDistrictId?.message || ""}
                  </ErrorMessage>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
              >
                Batal
              </Button>
            )}
            <Button type="submit" variant="green" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Simpan Perubahan" : "Buat Informasi"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
