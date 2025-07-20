import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Input } from "@/components/InputLovable";
import NextImage from "@/components/NextImage";
import { Separator } from "@/components/Separator";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import {
  ArrowLeft,
  Award,
  Leaf,
  Minus,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (id: string, quantity: number) => void;
}

const ProductDetail = ({
  productId,
  onBack,
  onAddToCart,
}: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1);

  // Mock product data - in real app, fetch based on productId
  const product = {
    id: productId,
    name: "Pupuk NPK 15-15-15 Premium",
    npkFormula: "15-15-15",
    price: 125000,
    unit: "karung 50kg",
    // image: npkProductImage,
    description:
      "Pupuk NPK 15-15-15 adalah pupuk majemuk lengkap yang mengandung unsur nitrogen (N), fosfor (P), dan kalium (K) dalam perbandingan seimbang. Sangat cocok untuk tanaman padi, jagung, dan sayuran.",
    benefits: [
      "Mengandung nitrogen 15% untuk pertumbuhan daun dan batang",
      "Fosfor 15% untuk perkembangan akar dan bunga",
      "Kalium 15% untuk ketahanan tanaman terhadap penyakit",
      "Formula seimbang untuk hasil panen maksimal",
    ],
    usage:
      "Aplikasikan 200-300 kg per hektar pada saat tanam dan 100-150 kg per hektar pada masa pertumbuhan vegetatif.",
    composition: {
      nitrogen: "15%",
      phosphor: "15%",
      potassium: "15%",
      other: "Unsur mikro dan bahan pengisi",
    },
    specifications: {
      weight: "50 kg",
      packaging: "Karung plastik",
      storage: "Tempat kering dan sejuk",
      expiry: "2 tahun dari tanggal produksi",
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-accent">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Katalog
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <Card className="border-border shadow-card">
            <CardContent className="p-0">
              <NextImage
                src="/dashboard/Hero.jpg"
                alt={product.name}
                className="w-full h-full object-cover"
                imgClassName="object-cover w-full h-full"
                width={600}
                height={400}
              />
            </CardContent>
          </Card>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="border-border">
              <CardContent className="p-3 text-center">
                <Leaf className="size-4 sm:size-6 text-primary mx-auto mb-1" />
                <Typography
                  variant="p"
                  className="text-xs md:text-xs text-muted-foreground"
                >
                  Organik
                </Typography>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-3 text-center">
                <Package className="size-4 sm:size-6 text-primary mx-auto mb-1" />
                <Typography
                  variant="p"
                  className="text-xs md:text-xs text-muted-foreground"
                >
                  50kg
                </Typography>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-3 text-center">
                <Award className="size-4 sm:size-6 text-primary mx-auto mb-1" />
                <Typography
                  variant="p"
                  className="text-xs md:text-xs text-muted-foreground"
                >
                  Premium
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3 bg-primary ">
              <Typography
                variant="p"
                className="text-sm md:text-sm text-primary-foreground"
              >
                Pupuk {product.npkFormula}
              </Typography>
            </Badge>

            <Typography
              variant="h1"
              className="text-xl md:text-3xl font-bold text-foreground mb-2"
            >
              {product.name}
            </Typography>
            <Typography
              variant="p"
              className="text-muted-foreground text-sm md:text-lg leading-relaxed"
            >
              {product.description}
            </Typography>
          </div>

          {/* Price and Purchase */}
          <Card className="border-border shadow-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-center">
                  <Typography variant="h3" className="font-bold text-primary">
                    {formatPrice(product.price)}
                  </Typography>
                  <Typography
                    variant="h6"
                    className="text-muted-foreground ml-2"
                  >
                    / {product.unit}
                  </Typography>
                </div>

                <Separator />

                {/* Quantity Selector */}
                <div className="flex flex-row items-center justify-center gap-4">
                  <Typography
                    variant="h4"
                    className="font-semibold text-foreground"
                  >
                    Jumlah
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-20 text-center text-sm sm:text-base lg:text-lg"
                      min="1"
                      id={""}
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-accent p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <Typography
                      variant="h6"
                      className="font-medium text-foreground"
                    >
                      Total Harga:
                    </Typography>
                    <Typography
                      variant="h3"
                      className=" font-bold text-primary"
                    >
                      {formatPrice(totalPrice)}
                    </Typography>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  variant="green"
                  onClick={handleAddToCart}
                  className="w-full  hover:bg-primary-dark shadow-button text-lg py-6"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <Typography
                    variant="h5"
                    className="text-primary-foreground font-semibold"
                  >
                    Tambah ke Keranjang
                  </Typography>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product Benefits */}
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle>
                <Typography variant="h3" className="font-bold">
                  Manfaat & Keunggulan
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <Typography variant="p" className="text-muted-foreground">
                      {benefit}
                    </Typography>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Composition */}
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle>
              <Typography variant="h3" className="font-bold">
                Komposisi
              </Typography>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <Typography variant="p" className="text-muted-foreground">
                Nitrogen (N):
              </Typography>
              <Typography variant="p" className="font-medium text-foreground">
                {product.composition.nitrogen}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="p" className="text-muted-foreground">
                Fosfor (P):
              </Typography>
              <Typography variant="p" className="font-medium text-foreground">
                {product.composition.phosphor}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="p" className="text-muted-foreground">
                Kalium (K):
              </Typography>
              <Typography variant="p" className="font-medium text-foreground">
                {product.composition.potassium}
              </Typography>
            </div>
            <Separator />
            <Typography variant="p" className="text-sm text-muted-foreground">
              {product.composition.other}
            </Typography>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle>
              <Typography variant="h3" className="font-bold">
                Spesifikasi
              </Typography>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <Typography variant="p" className="text-muted-foreground">
                Berat:
              </Typography>
              <Typography
                variant="p"
                className="font-medium text-foreground text-[10px] min-[350px]:text-xs"
              >
                {product.specifications.weight}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="p" className="text-muted-foreground">
                Kemasan:
              </Typography>
              <Typography
                variant="p"
                className="font-medium text-foreground text-[10px] min-[350px]:text-xs"
              >
                {product.specifications.packaging}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="p" className="text-muted-foreground">
                Penyimpanan:
              </Typography>
              <Typography
                variant="p"
                className="font-medium text-foreground text-[10px] min-[350px]:text-xs"
              >
                {product.specifications.storage}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="p" className="text-muted-foreground">
                Masa Simpan:
              </Typography>
              <Typography
                variant="p"
                className="font-medium text-foreground text-[10px] min-[350px]:text-xs"
              >
                {product.specifications.expiry}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Instructions */}
      <Card className="border-border shadow-card mt-6">
        <CardHeader>
          <CardTitle>
            <Typography variant="h3" className="font-bold">
              Cara Penggunaan
            </Typography>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Typography
            variant="p"
            className="text-muted-foreground leading-relaxed"
          >
            {product.usage}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;
