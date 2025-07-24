// src/app/(main)/components/ProductDetail.tsx
import { useGetAllProducts } from "@/app/(main)/hooks/useProduct";
import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Input } from "@/components/InputLovable";
import NextImage from "@/components/NextImage";
import { Separator } from "@/components/Separator";
import { Skeleton } from "@/components/Skeleton";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import { CartItem } from "@/types/order";
import { Packaging, ProductVariant } from "@/types/product";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
  packagings: Packaging[];
}

const ProductDetail = ({
  productId,
  onBack,
  onAddToCart,
  packagings,
}: ProductDetailProps) => {
  const { data: productData, isLoading } = useGetAllProducts({});
  const [quantities, setQuantities] = useState<{ [variantId: string]: number }>(
    {},
  );
  const [selectedVariantImage, setSelectedVariantImage] = useState<
    string | null
  >(null);

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
    const packaging = packagings.find((p) => p.id === variant.packagingId);

    if (product) {
      const itemToAdd: CartItem = {
        variantId: variant.id,
        productId: product.id,
        productName: product.name,
        composition: product.composition,
        price: variant.priceRupiah,
        weight_in_kg: variant.weight_in_kg,
        packagingName: packaging?.name || "N/A",
        quantity: quantity,
        imageUrl: variant.imageUrl,
      };
      onAddToCart(itemToAdd);
      toast.success(
        `${product.name} (${packaging?.name}) ditambahkan ke keranjang!`,
      );
    }
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
              src={selectedVariantImage ?? "/dashboard/Hero.jpg"}
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
                  src={variant.imageUrl ?? "/dashboard/Hero.jpg"}
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

                return (
                  <Card key={variant.id} className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
                      <NextImage
                        src={variant.imageUrl ?? "/dashboard/Hero.jpg"}
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
                        variant="green"
                        onClick={() => handleAddToCart(variant)}
                        className="w-full sm:w-auto"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
