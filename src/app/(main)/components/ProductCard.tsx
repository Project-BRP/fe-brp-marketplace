// src/app/(main)/components/ProductCard.tsx
import { Badge } from "@/components/Badge";
import { Card, CardContent } from "@/components/Card";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import { Packaging, Product } from "@/types/product";
import { ArrowRight } from "lucide-react";

type ProductCardProps = {
  product: Product;
  packagings: Packaging[];
  onViewDetail: (id: string) => void;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function ProductCard({
  product,
  packagings,
  onViewDetail,
}: ProductCardProps) {
  const renderPrice = () => {
    if (!product.variants || product.variants.length === 0) {
      return (
        <Typography variant="p" className="text-muted-foreground">
          Harga tidak tersedia
        </Typography>
      );
    }

    if (product.variants.length > 1) {
      const prices = product.variants.map((v) => v.priceRupiah);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return (
        <div className="font-bold text-primary">
          {formatPrice(minPrice)} - {formatPrice(maxPrice)}
        </div>
      );
    }

    const variant = product.variants[0];
    const packaging = packagings.find((p) => p.id === variant.packagingId);
    return (
      <div className="font-bold text-primary">
        {formatPrice(variant.priceRupiah)}{" "}
        {packaging && (
          <span className="text-sm font-normal text-muted-foreground">
            / {packaging.name}
          </span>
        )}
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
      <div>
        <NextImage
          src={product.variants?.[0]?.imageUrl ?? "/dashboard/Hero.jpg"}
          alt={product.name}
          width={400}
          height={300}
          className="w-full"
          imgClassName="object-cover w-full h-full aspect-[4/3]"
        />
        <CardContent className="p-4 flex-grow flex flex-col">
          <Badge variant="secondary" className="w-fit mb-2">
            {product.productType?.name ?? "N/A"}
          </Badge>
          <Typography
            as="h3"
            variant="h6"
            weight="semibold"
            className="flex-grow mb-2"
          >
            {product.name}
          </Typography>
          <div className="text-lg">{renderPrice()}</div>
        </CardContent>
      </div>
      <div className="p-4 pt-0 mt-auto">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onViewDetail(product.id)}
        >
          Info Produk
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}
