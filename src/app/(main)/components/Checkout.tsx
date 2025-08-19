"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateTransaction } from "@/app/(main)/hooks/useTransaction";
import { Separator } from "@/components/Separator";
import { Skeleton } from "@/components/Skeleton";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import useUserStore from "@/store/userStore";

import { useGetPPN } from "@/app/admin/settings/hooks/usePPN";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { RadioGroup, RadioGroupItem } from "@/components/RadioGroup";
import { ArrowLeft, MapPin, Truck, User } from "lucide-react";
import { useGetCart } from "../hooks/useCart";
// Asumsikan hook-hook ini ada di dalam useShipping.ts untuk mengambil data lokasi
import {
  useCheckCost,
  useGetCities,
  useGetDistricts,
  useGetProvinces,
  useGetSubDistricts,
} from "../hooks/useShipping";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"; // Import Select
import { Textarea } from "@/components/TextArea";
import clsxm from "@/lib/clsxm";
import { ShippingOption } from "@/types/shipping";

// Skema validasi diperbarui untuk form alamat manual
const formSchema = z.object({
  shippingAddress: z.string().min(1, "Alamat lengkap harus diisi"),
  provinceId: z.string().min(1, "Provinsi harus dipilih"),
  cityId: z.string().min(1, "Kota/Kabupaten harus dipilih"),
  districtId: z.string().min(1, "Kecamatan harus dipilih"),
  subdistrictId: z.string().min(1, "Kelurahan/Desa harus dipilih"),
  postalCode: z.string().min(5, "Kode pos harus 5 digit"),
  method: z.enum(["MANUAL", "DELIVERY"]),
});

interface CheckoutProps {
  onBack: () => void;
}

export default function Checkout({ onBack }: CheckoutProps) {
  const { userData } = useUserStore();
  const { data: cartData, isLoading: isCartLoading } = useGetCart();
  const { data: ppnData } = useGetPPN();
  const { mutate: createTransaction, isPending: isCreatingTransaction } =
    useCreateTransaction();
  const { refetch: refetchCart } = useGetCart();
  const { mutate: checkCost } = useCheckCost();

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [totalWeight, setTotalWeight] = useState(0);

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingAddress: "",
      provinceId: "",
      cityId: "",
      districtId: "",
      subdistrictId: "",
      postalCode: "",
      method: "DELIVERY",
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  // Mengawasi perubahan pada dropdown
  const watchedProvinceId = watch("provinceId");
  const watchedCityId = watch("cityId");
  const watchedDistrictId = watch("districtId");
  const watchedSubdistrictId = watch("subdistrictId");

  // Fetch data untuk dropdown
  const { data: provinces, isLoading: isProvincesLoading } = useGetProvinces();
  const { data: cities, isLoading: isCitiesLoading } =
    useGetCities(watchedProvinceId);
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistricts(
    watchedProvinceId,
    watchedCityId,
  );
  const { data: subdistricts, isLoading: isSubdistrictsLoading } =
    useGetSubDistricts(watchedProvinceId, watchedCityId, watchedDistrictId);

  console.log("Provinces:", provinces);
  console.log("Cities:", cities);
  console.log("Districts:", districts);
  console.log("Subdistricts:", subdistricts);

  // Reset dropdown anak jika parent berubah
  useEffect(() => {
    setValue("cityId", "");
    setValue("districtId", "");
    setValue("subdistrictId", "");
    setValue("postalCode", "");
  }, [watchedProvinceId, setValue]);

  useEffect(() => {
    setValue("districtId", "");
    setValue("subdistrictId", "");
    setValue("postalCode", "");
  }, [watchedCityId, setValue]);

  useEffect(() => {
    setValue("subdistrictId", "");
    setValue("postalCode", "");
  }, [watchedDistrictId, setValue]);

  // Set postal code saat subdistrict dipilih
  useEffect(() => {
    if (watchedSubdistrictId) {
      const selectedSubdistrict = subdistricts?.find(
        (s) => s.id === Number(watchedSubdistrictId),
      );
      if (selectedSubdistrict) {
        setValue("postalCode", selectedSubdistrict.zip_code);
      }
    }
  }, [watchedSubdistrictId, subdistricts, setValue]);

  useEffect(() => {
    if (cartData?.items) {
      const weight = cartData.items.reduce(
        (acc, item) => acc + item.productVariant.weight_in_kg * item.quantity,
        0,
      );
      setTotalWeight(weight);
    }
  }, [cartData]);

  useEffect(() => {
    if (watchedSubdistrictId && totalWeight > 0) {
      console.log(totalWeight);
      checkCost(
        {
          destinationProvince: Number(watchedProvinceId),
          destinationCity: Number(watchedCityId),
          destinationDistrict: Number(watchedDistrictId),
          destinationSubDistrict: Number(watchedSubdistrictId),
          weight_in_kg: totalWeight,
        },
        {
          onSuccess: (data) => {
            setShippingOptions(
              data.data.shippingOptions.filter(
                (option) =>
                  option.service !== "NOT FOUND" &&
                  option.etd !== "-" &&
                  option.etd !== "",
              ),
            );
          },
        },
      );
    }
    setShippingOptions([]);
  }, [
    watchedProvinceId,
    watchedCityId,
    watchedDistrictId,
    watchedSubdistrictId,
    totalWeight,
    checkCost,
  ]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createTransaction({
      ...values,
      provinceId: Number(values.provinceId),
      cityId: Number(values.cityId),
      districtId: Number(values.districtId),
      subdistrictId: Number(values.subdistrictId),
      // postalCode tetap string
    });
    refetchCart();
  };

  const calculateTotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce(
      (acc, item) => acc + item.productVariant.priceRupiah * item.quantity,
      0,
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const total = calculateTotal();
  const ppn = (total * (ppnData?.percentage || 0)) / 100;
  const grandTotal = total + ppn + (selectedShipping?.cost || 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-accent">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Keranjang
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informasi Pelanggan */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                <Typography
                  variant="h6"
                  className="text-lg font-bold sm:text-xl md:text-2xl"
                >
                  Informasi Pelanggan
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Typography variant="h6" className="font-semibold">
                    Nama Lengkap
                  </Typography>
                  <Typography variant="p">{userData.name}</Typography>
                </div>
                <div className="space-y-2">
                  <Typography variant="h6" className="font-semibold">
                    Nomor Telepon
                  </Typography>
                  <Typography variant="p">{userData.phoneNumber}</Typography>
                </div>
              </div>
              <div className="space-y-2">
                <Typography variant="h6" className="font-semibold">
                  Email
                </Typography>
                <Typography variant="p">{userData.email}</Typography>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <Typography
                  variant="h6"
                  className="min-[400px]:text-2xl text-lg font-bold"
                >
                  Alamat Pengiriman
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Typography variant="h6" className="font-semibold">
                      Alamat Lengkap
                    </Typography>
                    <Textarea
                      {...methods.register("shippingAddress", {
                        required: "Alamat lengkap harus diisi",
                      })}
                      id="shippingAddress"
                      placeholder="Contoh: Jl. Pahlawan No. 10, RT 01/RW 02"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Provinsi */}
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

                    {/* Kota/Kabupaten */}
                    <Select
                      onValueChange={(value) => setValue("cityId", value)}
                      value={watchedCityId}
                      disabled={!watchedProvinceId || isCitiesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isCitiesLoading
                              ? "Memuat..."
                              : "Pilih Kota/Kabupaten"
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

                    {/* Kecamatan */}
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

                    {/* Kelurahan/Desa */}
                    <Select
                      onValueChange={(value) =>
                        setValue("subdistrictId", value)
                      }
                      value={watchedSubdistrictId}
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
                    {/* Kode Pos */}
                    <Typography variant="h6" className="font-semibold">
                      Kode Pos
                    </Typography>
                    <Typography variant="p" className="text-muted-foreground">
                      {watch("postalCode") || "Silahkan pilih kelurahan/desa"}
                    </Typography>
                  </div>

                  <div className="space-y-2">
                    <Typography variant="h6" className="font-semibold">
                      Metode
                    </Typography>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="green"
                        className={
                          watch("method") === "DELIVERY"
                            ? "bg-green-500"
                            : "bg-green-50 text-black/50"
                        }
                        onClick={() => setValue("method", "DELIVERY")}
                      >
                        Antar Barang
                      </Button>
                      <Button
                        type="button"
                        variant="green"
                        className={
                          watch("method") === "MANUAL"
                            ? "bg-green-500"
                            : "bg-green-50 text-black/50 "
                        }
                        onClick={() => setValue("method", "MANUAL")}
                      >
                        Ambil Sendiri
                      </Button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
          {watch("method") === "DELIVERY" && (
            <Card className="border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  <Typography
                    variant="h6"
                    className="min-[400px]:text-2xl text-lg font-bold"
                  >
                    Opsi Pengiriman
                  </Typography>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  onValueChange={(value) =>
                    setSelectedShipping(
                      shippingOptions.find(
                        (o) => `${o.name}-${o.service}` === value,
                      ) || null,
                    )
                  }
                >
                  {shippingOptions.map((option, index) => (
                    <div key={`${option.service}-${index}`}>
                      <RadioGroupItem
                        value={`${option.name}-${option.service}`}
                        id={`${option.service}-${index}`}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={`${option.service}-${index}`}
                        className={clsxm(
                          "block p-4 border-2 rounded-lg cursor-pointer",
                          "peer-checked:border-green-500 peer-checked:ring-4 peer-checked:ring-green-500",
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <Typography variant="p" className="font-semibold">
                            {option.name} - {option.service}
                          </Typography>
                          <Typography variant="p" className="font-bold">
                            {formatPrice(option.cost)}
                          </Typography>
                        </div>
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-sm mt-1"
                        >
                          Estimasi: {option.etd}
                        </Typography>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ringkasan Pesanan */}
        <div className="lg:col-span-1">
          <Card className="border-border shadow-card sticky top-6">
            <CardHeader>
              <CardTitle>
                <Typography
                  variant="h6"
                  className="min-[400px]:text-2xl text-lg font-bold"
                >
                  Ringkasan Pesanan
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {isCartLoading ? (
                  <>
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </>
                ) : (
                  cartData?.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start gap-4"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">
                          {item.productVariant.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.productVariant.priceRupiah)} /{" "}
                          {item.productVariant.packaging?.name} (
                          {item.productVariant.weight_in_kg} kg)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-foreground text-sm">
                        {formatPrice(
                          item.productVariant.priceRupiah * item.quantity,
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography variant="p" className="text-muted-foreground">
                    Subtotal
                  </Typography>
                  <Typography variant="p" className="text-foreground">
                    {formatPrice(total)}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  {ppnData ? (
                    <Typography variant="p" className="text-muted-foreground">
                      PPN ({ppnData.percentage}%)
                    </Typography>
                  ) : (
                    <Skeleton className="h-4 w-24" />
                  )}
                  <Typography variant="p" className="text-foreground">
                    {formatPrice(ppn)}
                  </Typography>
                </div>
                {watch("method") === "DELIVERY" && (
                  <div className="flex justify-between">
                    <Typography variant="p" className="text-muted-foreground">
                      Ongkos Kirim
                    </Typography>
                    <Typography variant="p" className="text-foreground">
                      {selectedShipping
                        ? formatPrice(selectedShipping.cost)
                        : "-"}
                    </Typography>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <Typography variant="h4">Total</Typography>
                  <Typography variant="h4" className="font-semibold">
                    {formatPrice(grandTotal)}
                  </Typography>
                </div>
              </div>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="w-full hover:bg-primary-dark shadow-button text-lg py-6"
                isLoading={isCreatingTransaction}
                disabled={
                  isCreatingTransaction ||
                  isCartLoading ||
                  !cartData?.items.length ||
                  (watch("method") === "DELIVERY" && !selectedShipping)
                }
              >
                Buat Pesanan & Lanjutkan Pembayaran
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang
                berlaku.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
