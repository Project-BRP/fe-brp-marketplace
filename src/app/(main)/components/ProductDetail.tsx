// src/app/(main)/components/ProductDetail.tsx
"use client";

import { useAddToCart } from "@/app/(main)/hooks/useCart";
import { useGetAllProducts } from "@/app/(main)/hooks/useProduct";
import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Input } from "@/components/InputLovable";
import NextImage from "@/components/NextImage";
import { Separator } from "@/components/Separator";
import { Skeleton } from "@/components/Skeleton";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import useUserStore from "@/store/userStore";
import { Packaging, ProductVariant } from "@/types/product";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  packagings: Packaging[];
}

const ProductDetail = ({
  productId,
  onBack,
  packagings,
}: ProductDetailProps) => {
  const { userData } = useUserStore();
  const { data: productData, isLoading } = useGetAllProducts({});
  const [quantities, setQuantities] = useState<{ [variantId: string]: number }>(
    {},
  );
  const [selectedVariantImage, setSelectedVariantImage] = useState<
    string | null
  >(null);
  // State untuk melacak varian mana yang sedang loading
  const [loadingVariantId, setLoadingVariantId] = useState<string | null>(null);

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const product = productData?.products.find((p) => p.id === productId);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariantImage(product.variants[0].imageUrl);
    }
  }, [product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (variantId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [variantId]: Math.max(1, quantity),
    }));
  };

  const handleAddToCart = (variant: ProductVariant) => {
    const quantity = quantities[variant.id] || 1;
    setLoadingVariantId(variant.id);
    addToCart(
      { variantId: variant.id, quantity: quantity },
      {
        onSettled: () => {
          setLoadingVariantId(null);
        },
      },
    );
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        Produk tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-accent">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Katalog
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border shadow-card overflow-hidden">
            <NextImage
              src={
                product?.imageUrl
                  ? process.env.NEXT_PUBLIC_IMAGE_URL + product.imageUrl
                  : "/dashboard/Hero.jpg"
              }
              alt={product.name}
              width={600}
              height={600}
              className="w-full aspect-square"
              imgClassName="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </Card>
          <div className="grid grid-cols-5 gap-2">
            {product.variants?.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantImage(variant.imageUrl)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedVariantImage === variant.imageUrl
                    ? "border-primary ring-2 ring-primary/50"
                    : "border-transparent hover:border-primary/50"
                }`}
              >
                <NextImage
                  src={
                    variant.imageUrl
                      ? process.env.NEXT_PUBLIC_IMAGE_URL + variant.imageUrl
                      : "/dashboard/Hero.jpg"
                  }
                  alt={`Varian ${variant.weight_in_kg} kg`}
                  width={100}
                  height={100}
                  className="w-full h-full"
                  imgClassName="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Info & Variants */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <Badge
              variant="secondary"
              className="mb-3 bg-primary text-primary-foreground"
            >
              {product.productType?.name ?? "N/A"}
            </Badge>
            <Typography
              variant="h1"
              className="text-3xl md:text-4xl font-bold text-foreground mb-3"
            >
              {product.name}
            </Typography>
            <Typography
              variant="p"
              className="text-muted-foreground md:text-lg leading-relaxed"
            >
              {product.description}
            </Typography>
          </div>

          <Separator />

          <div>
            <Typography variant="h5" weight="semibold" className="mb-4">
              Pilih Varian Kemasan
            </Typography>
            <div className="space-y-4">
              {product.variants?.map((variant) => {
                const packaging = packagings.find(
                  (p) => p.id === variant.packagingId,
                );
                const quantity = quantities[variant.id] || 1;
                const isLoadingThisVariant =
                  isAddingToCart && loadingVariantId === variant.id;

                return (
                  <Card key={variant.id} className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
                      <NextImage
                        src={
                          variant.imageUrl
                            ? process.env.NEXT_PUBLIC_IMAGE_URL +
                              variant.imageUrl
                            : "/dashboard/Hero.jpg"
                        }
                        alt={packaging?.name || "Varian"}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-md flex-shrink-0"
                        imgClassName="object-cover w-full h-full"
                      />
                      <div className="flex-1 w-full">
                        <Typography variant="h6" weight="semibold">
                          {packaging?.name || "N/A"} ({variant.weight_in_kg} kg)
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-primary font-bold text-lg"
                        >
                          {formatPrice(variant.priceRupiah)}
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-sm"
                        >
                          Stok: {variant.stock}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2"
                          onClick={() =>
                            handleQuantityChange(variant.id, quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              variant.id,
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="w-16 text-center h-9"
                          min="1"
                          id={`qty-${variant.id}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2"
                          onClick={() =>
                            handleQuantityChange(variant.id, quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        id={`add-to-cart-${variant.id}`}
                        variant="green"
                        onClick={() => handleAddToCart(variant)}
                        className="w-full sm:w-auto disabled:bg-slate-400 disabled:text-white disabled:cursor-not-allowed disabled:border-none"
                        disabled={isLoadingThisVariant || !userData.name}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isLoadingThisVariant
                          ? "Menambahkan..."
                          : "Tambahkan ke Keranjang"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {!userData.name && (
              <Typography variant="p" className="text-red-500 mt-4">
                Silakan masuk atau daftar untuk menambahkan produk ke keranjang.
              </Typography>
            )}
          </div>
        </div>
      </div>

      {/* Full-width Additional Info Section */}
      <div className="mt-12 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Typography variant="h3" className="font-bold">
                Informasi Detail Produk
              </Typography>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <Typography variant="h6" weight="semibold" className="mb-2">
                Komposisi
              </Typography>
              <Typography variant="p" className="text-muted-foreground">
                {product.composition}
              </Typography>
            </div>
            <Separator />
            <div>
              <Typography variant="h6" weight="semibold" className="mb-2">
                Manfaat & Keunggulan
              </Typography>
              <Typography variant="p" className="text-muted-foreground">
                {product.benefits}
              </Typography>
            </div>
            <Separator />
            <div>
              <Typography variant="h6" weight="semibold" className="mb-2">
                Cara Penggunaan
              </Typography>
              <Typography variant="p" className="text-muted-foreground">
                {product.usageInstructions}
              </Typography>
            </div>
            <Separator />
            <div>
              <Typography variant="h6" weight="semibold" className="mb-2">
                Petunjuk Penyimpanan
              </Typography>
              <Typography variant="p" className="text-muted-foreground">
                {product.storageInstructions}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-6">
    <Skeleton className="h-10 w-48 mb-6" />
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="w-full aspect-square rounded-lg" />
        <div className="grid grid-cols-5 gap-2">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="aspect-square rounded-lg" />
        </div>
      </div>
      <div className="lg:col-span-3 space-y-6">
        <Skeleton className="h-6 w-1/4 mb-3" />
        <Skeleton className="h-10 w-3/4 mb-3" />
        <Skeleton className="h-20 w-full" />
        <Separator />
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetail;
