import { Badge } from "@/components/Badge";
import { Card, CardContent, CardFooter } from "@/components/Card";
import NextImage from "@/components/NextImage";
import Button from "@/components/buttons/Button";
import { Product } from "@/types/product";
import { Eye, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onViewDetail: (id: string) => void;
  onAddToCart: (id: string) => void;
}

const ProductCard = ({
  product,
  onViewDetail,
  onAddToCart,
}: ProductCardProps) => {
  // FIX: Use `variants` and optional chaining `?.` for safety
  const displayVariant = product.variants?.[0];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-card border-border flex flex-col justify-between">
      <CardContent className="p-0 h-full flex flex-col justify-start">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <NextImage
            src={displayVariant?.imageUrl ?? "/dashboard/Hero.jpg"}
            alt={product.name}
            className="w-full h-48 group-hover:scale-105 transition-transform duration-300"
            imgClassName="object-cover w-full h-full"
            width={300}
            height={200}
          />
          {displayVariant && (
            <Badge
              variant="secondary"
              className="absolute top-3 left-3 bg-primary text-primary-foreground shadow-button"
            >
              {product.productType?.name ?? `${displayVariant.id}`}
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-grow">
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        </div>
      </CardContent>
      {displayVariant && (
        <>
          <div className="flex items-center justify-between mb-4 px-5">
            <div>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(displayVariant.priceRupiah)}
              </span>
              <span className="text-muted-foreground text-sm ml-1">
                / {displayVariant.weight}
              </span>
            </div>
          </div>
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-accent"
              onClick={() => onViewDetail(product.id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Detail
            </Button>
            <Button
              variant="green"
              size="sm"
              className="flex-1 hover:bg-primary-dark shadow-button"
              onClick={() => onAddToCart(product.id)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Tambah
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default ProductCard;
