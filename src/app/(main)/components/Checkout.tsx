"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import {
  useCreateTransaction,
  useGetPPN,
} from "@/app/(main)/hooks/useTransaction";
import { Separator } from "@/components/Separator";
import { Skeleton } from "@/components/Skeleton";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import useUserStore from "@/store/userStore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { ArrowLeft, MapPin, User } from "lucide-react";
import { useGetCart } from "../hooks/useCart";

// Skema validasi untuk form alamat pengiriman
const formSchema = z.object({
  shippingAddress: z.string().min(1, "Alamat pengiriman harus diisi"),
  city: z.string().min(1, "Kota harus diisi"),
  province: z.string().min(1, "Provinsi harus diisi"),
  postalCode: z
    .string()
    .min(5, "Kode pos harus 5 digit")
    .max(5, "Kode pos harus 5 digit"),
});

interface CheckoutProps {
  onBack: () => void;
  onOrderSubmit: () => void;
}

export default function Checkout({ onBack, onOrderSubmit }: CheckoutProps) {
  const router = useRouter();
  const { userData } = useUserStore();
  const { data: cartData, isLoading: isCartLoading } = useGetCart();
  const { data: ppnData } = useGetPPN();
  const { mutate: createTransaction, isPending: isCreatingTransaction } =
    useCreateTransaction();

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingAddress: "",
      city: "",
      province: "",
      postalCode: "",
    },
  });

  // Destrukturisasi register dan errors dari methods
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  // Fungsi yang dipanggil saat form disubmit
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createTransaction(values);
    onOrderSubmit();
  };

  // Menghitung total harga dari keranjang
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
            <CardContent className="space-y-4">
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="shippingAddress"
                      label="Alamat Lengkap"
                      validation={{
                        required: "Alamat pengiriman harus diisi",
                      }}
                      placeholder="Contoh: Jl. Pahlawan No. 10"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Input
                        id="city"
                        label="Kota/Kabupaten"
                        validation={{ required: "Kota harus diisi" }}
                        placeholder="Contoh: Surabaya"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="postalCode"
                        label="Kode Pos"
                        validation={{ required: "Kode pos harus diisi" }}
                        placeholder="Contoh: 60234"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="province"
                        label="Provinsi"
                        validation={{ required: "Provinsi harus diisi" }}
                        placeholder="Contoh: Jawa Timur"
                      />
                    </div>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
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
                  <Typography variant="p" className="text-muted-foreground">
                    PPN (12%)
                  </Typography>
                  <Typography variant="p" className="text-foreground">
                    {formatPrice(total * 0.12)}
                  </Typography>
                </div>
                <div className="flex justify-between font-bold">
                  <Typography variant="h4">Total</Typography>
                  <Typography variant="h4" className="font-semibold">
                    {formatPrice(total * 1.12)}
                  </Typography>
                </div>
              </div>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="w-full  hover:bg-primary-dark shadow-button text-lg py-6"
                isLoading={isCreatingTransaction}
                disabled={
                  isCreatingTransaction ||
                  isCartLoading ||
                  !cartData?.items.length
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
