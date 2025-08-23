"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

// --- UI Components ---
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion"; // Pastikan path ini benar
import { Badge } from "@/components/Badge"; // Pastikan path ini benar
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { RadioGroup, RadioGroupItem } from "@/components/RadioGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Separator } from "@/components/Separator";
import { Skeleton } from "@/components/Skeleton";
import { Textarea } from "@/components/TextArea";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";

import { useCreateTransaction } from "@/app/(main)/hooks/useTransaction";
// --- Hooks ---
import { useGetPPN } from "@/app/admin/settings/hooks/usePPN";
import { useGetCart } from "../hooks/useCart";
import {
  useCheckCost,
  useGetCities,
  useGetDistricts,
  useGetProvinces,
  useGetSubDistricts,
} from "../hooks/useShipping";

import clsxm from "@/lib/clsxm";
// --- Utils & Types ---
import useUserStore from "@/store/userStore";
import { ShippingOption } from "@/types/shipping";
import { ArrowLeft, MapPin, Truck, User } from "lucide-react";
import { useRouter } from "next/navigation";

// Skema validasi tidak berubah
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

// Helper function
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function Checkout({ onBack }: CheckoutProps) {
  const { userData } = useUserStore();
  const { data: cartData, isLoading: isCartLoading } = useGetCart();
  const { data: ppnData } = useGetPPN();
  const { mutate: createTransaction, isPending: isCreatingTransaction } =
    useCreateTransaction();
  const { refetch: refetchCart } = useGetCart();
  const { mutate: checkCost, isPending: isCheckingCost } = useCheckCost();

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [totalWeight, setTotalWeight] = useState(0);
  const router = useRouter();
  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingAddress: "",
      provinceId: "",
      cityId: "",
      districtId: "",
      subdistrictId: "",
      postalCode: "",
      method: "DELIVERY", // Default method
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  const watchedProvinceId = watch("provinceId");
  const watchedCityId = watch("cityId");
  const watchedDistrictId = watch("districtId");
  const watchedSubdistrictId = watch("subdistrictId");
  const watchedMethod = watch("method"); // Mengawasi perubahan metode

  const { data: provinces, isLoading: isProvincesLoading } = useGetProvinces();
  const { data: cities, isLoading: isCitiesLoading } =
    useGetCities(watchedProvinceId);
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistricts(
    watchedProvinceId,
    watchedCityId,
  );
  const { data: subdistricts, isLoading: isSubdistrictsLoading } =
    useGetSubDistricts(watchedProvinceId, watchedCityId, watchedDistrictId);

  // Reset dropdown anak jika parent berubah
  useEffect(() => {
    setValue("cityId", "");
    setValue("districtId", "");
    setValue("subdistrictId", "");
    setValue("postalCode", "");
    setShippingOptions([]);
    setSelectedShipping(null);
  }, [watchedProvinceId, setValue]);

  useEffect(() => {
    setValue("districtId", "");
    setValue("subdistrictId", "");
    setValue("postalCode", "");
    setShippingOptions([]);
    setSelectedShipping(null);
  }, [watchedCityId, setValue]);

  useEffect(() => {
    setValue("subdistrictId", "");
    setValue("postalCode", "");
    setShippingOptions([]);
    setSelectedShipping(null);
  }, [watchedDistrictId, setValue]);

  // Set postal code saat subdistrict dipilih
  useEffect(() => {
    if (watchedSubdistrictId && subdistricts) {
      const selectedSubdistrict = subdistricts.find(
        (s) => s.id === Number(watchedSubdistrictId),
      );
      if (selectedSubdistrict) {
        setValue("postalCode", selectedSubdistrict.zip_code);
      }
    }
  }, [watchedSubdistrictId, subdistricts, setValue]);

  // Hitung total berat
  useEffect(() => {
    if (cartData?.items) {
      const weight = cartData.items.reduce(
        (acc, item) => acc + item.productVariant.weight_in_kg * item.quantity,
        0,
      );
      setTotalWeight(weight);
    }
  }, [cartData]);

  // Cek ongkos kirim
  useEffect(() => {
    if (
      watchedMethod === "DELIVERY" &&
      watchedSubdistrictId &&
      totalWeight > 0
    ) {
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
            const validOptions =
              data.data.shippingOptions.filter(
                (option) =>
                  option.service !== "NOT FOUND" &&
                  option.etd !== "-" &&
                  option.etd !== "",
              ) || [];
            setShippingOptions(validOptions);
          },
          onError: () => {
            setShippingOptions([]);
          },
        },
      );
    } else {
      setShippingOptions([]);
    }
  }, [
    watchedMethod,
    watchedProvinceId,
    watchedCityId,
    watchedDistrictId,
    watchedSubdistrictId,
    totalWeight,
    checkCost,
  ]);

  // Logika untuk mengelompokkan dan mencari opsi termurah
  const { groupedOptions, cheapestOptionId } = useMemo(() => {
    if (!shippingOptions || shippingOptions.length === 0) {
      return { groupedOptions: {}, cheapestOptionId: null };
    }

    const grouped = shippingOptions.reduce(
      (acc, option) => {
        const courierCode = option.code;
        if (!acc[courierCode]) {
          acc[courierCode] = { name: option.name, services: [] };
        }
        acc[courierCode].services.push(option);
        return acc;
      },
      {} as Record<string, { name: string; services: ShippingOption[] }>,
    );

    Object.values(grouped).forEach((courier) => {
      courier.services.sort((a, b) => a.cost - b.cost);
    });

    const cheapest = shippingOptions.reduce((prev, current) =>
      prev.cost < current.cost ? prev : current,
    );
    const cheapestId = `${cheapest.name}-${cheapest.service}`;

    return { groupedOptions: grouped, cheapestOptionId: cheapestId };
  }, [shippingOptions]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const basePayload = {
      shippingAddress: values.shippingAddress,
      province: Number(values.provinceId),
      city: Number(values.cityId),
      district: Number(values.districtId),
      subDistrict: Number(values.subdistrictId),
      postalCode: values.postalCode,
      method: values.method,
    };

    let finalPayload;

    if (values.method === "DELIVERY") {
      // Jika metode adalah DELIVERY...
      finalPayload = {
        ...basePayload,
        shippingCode: selectedShipping?.code, // Ganti dari 'shipping_courier'
        shippingService: selectedShipping?.service, // Ganti dari 'shipping_service'
        // 'postalCode' tidak disertakan di sini
      };
    } else {
      // Jika metode adalah MANUAL...
      finalPayload = {
        ...basePayload,
        // 'shippingCode' dan 'shippingService' tidak disertakan di sini
      };
    }

    // 4. Kirim payload akhir ke API.
    createTransaction(finalPayload, {
      onSuccess: (data) => {
        refetchCart();
        router.push(`/transactions?transaction_id=${data.data.id}`);
      },
    });
  };

  const total = useMemo(() => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce(
      (acc, item) => acc + item.productVariant.priceRupiah * item.quantity,
      0,
    );
  }, [cartData]);

  const ppn = (total * (ppnData?.percentage || 0)) / 100;
  const shippingCost =
    watchedMethod === "DELIVERY" ? selectedShipping?.cost || 0 : 0;
  const grandTotal = total + ppn + shippingCost;

  return (
    <div className="container mx-auto px-4 py-6">
      <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-accent">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Keranjang
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Informasi Pelanggan */}
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

          {/* Metode & Alamat */}
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <Typography
                  variant="h6"
                  className="min-[400px]:text-2xl text-lg font-bold"
                >
                  Metode & Alamat
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form className="space-y-6">
                  {/* [DIKEMBALIKAN] Pilihan Metode */}
                  <div className="space-y-3">
                    <Typography variant="h6" className="font-semibold">
                      Metode Pengambilan
                    </Typography>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant={
                          watchedMethod === "DELIVERY" ? "green" : "outline"
                        }
                        onClick={() => setValue("method", "DELIVERY")}
                      >
                        DELIVERY
                      </Button>
                      <Button
                        type="button"
                        variant={
                          watchedMethod === "MANUAL" ? "green" : "outline"
                        }
                        onClick={() => setValue("method", "MANUAL")}
                      >
                        MANUAL
                      </Button>
                    </div>
                    {watchedMethod === "MANUAL" && (
                      <Typography variant="p" className="text-muted-foreground">
                        Setelah melakukan transaksi dengan metode "MANUAL".
                        Silakan tunggu konfirmasi dari admin melalui WhatsApp
                        untuk langkah selanjutnya.
                      </Typography>
                    )}
                  </div>

                  {/* Form Alamat hanya muncul jika metode DELIVERY */}

                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Typography variant="h6" className="font-semibold">
                        Alamat Lengkap
                      </Typography>
                      <Textarea
                        {...methods.register("shippingAddress")}
                        id="shippingAddress"
                        placeholder="Contoh: Jl. Pahlawan No. 10, RT 01/RW 02"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        onValueChange={(value) => setValue("provinceId", value)}
                        value={watchedProvinceId}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isProvincesLoading
                                ? "Memuat..."
                                : "Pilih Provinsi"
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
                      <Select
                        onValueChange={(value) => setValue("districtId", value)}
                        value={watchedDistrictId}
                        disabled={!watchedCityId || isDistrictsLoading}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isDistrictsLoading
                                ? "Memuat..."
                                : "Pilih Kecamatan"
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
                    </div>
                    <div className="space-y-2">
                      <Typography variant="h6" className="font-semibold">
                        Kode Pos
                      </Typography>
                      <Typography variant="p" className="text-muted-foreground">
                        {watch("postalCode") || "Otomatis terisi"}
                      </Typography>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>

          {/* Opsi Pengiriman hanya muncul jika metode DELIVERY */}
          {watchedMethod === "DELIVERY" && (
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
                {!watchedSubdistrictId ? (
                  <p className="text-muted-foreground text-center py-4">
                    Silakan lengkapi alamat pengiriman untuk melihat opsi
                    pengiriman.
                  </p>
                ) : isCheckingCost ? (
                  <div className="space-y-2 py-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : shippingOptions.length > 0 ? (
                  <RadioGroup
                    onValueChange={(value) => {
                      const selected = shippingOptions.find(
                        (o) => `${o.name}-${o.service}` === value,
                      );
                      setSelectedShipping(selected || null);
                    }}
                    className="w-full"
                  >
                    <Accordion type="single" collapsible className="w-full">
                      {Object.entries(groupedOptions).map(([code, courier]) => (
                        <AccordionItem value={`item-${code}`} key={code}>
                          <AccordionTrigger className="font-bold text-lg hover:no-underline">
                            {courier.name}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col gap-4 pt-2">
                              {courier.services.map((option) => {
                                const optionId = `${option.name}-${option.service}`;
                                return (
                                  <div key={optionId}>
                                    <RadioGroupItem
                                      value={optionId}
                                      id={optionId}
                                      className="peer sr-only"
                                    />
                                    <label
                                      htmlFor={optionId}
                                      className={clsxm(
                                        "block p-4 border-2 rounded-lg cursor-pointer transition-colors relative",
                                        "peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-50",
                                      )}
                                    >
                                      {optionId === cheapestOptionId && (
                                        <Badge className="absolute -top-3 right-3 bg-green-100 text-green-800">
                                          Paling Hemat
                                        </Badge>
                                      )}
                                      <div className="flex justify-between items-center">
                                        <Typography
                                          variant="p"
                                          className="font-semibold"
                                        >
                                          {option.service}{" "}
                                          <span className="text-sm font-normal text-muted-foreground">
                                            ({option.description})
                                          </span>
                                        </Typography>
                                        <Typography
                                          variant="p"
                                          className="font-bold"
                                        >
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
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </RadioGroup>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Tidak ada opsi pengiriman yang tersedia untuk alamat ini.
                  </p>
                )}
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
                {/* [DIKEMBALIKAN] Ongkos kirim hanya muncul jika metode DELIVERY */}
                {watchedMethod === "DELIVERY" && (
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
                  (watchedMethod === "DELIVERY" && !selectedShipping)
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
