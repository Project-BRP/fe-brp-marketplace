import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Leaf,
  Package,
  Award,
} from "lucide-react";
import Button from "@/components/buttons/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Separator } from "@/components/Separator";

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
              {/* <img
								src={product.image.src}
								alt={product.name}
								className="w-full h-96 object-cover rounded-lg"
							/> */}
            </CardContent>
          </Card>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="border-border">
              <CardContent className="p-3 text-center">
                <Leaf className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Organik</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-3 text-center">
                <Package className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">50kg</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-3 text-center">
                <Award className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Premium</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge
              variant="secondary"
              className="mb-3 bg-primary text-primary-foreground"
            >
              NPK {product.npkFormula}
            </Badge>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {product.name}
            </h1>
            <p className="text-muted-foreground text-lg">
              {product.description}
            </p>
          </div>

          {/* Price and Purchase */}
          <Card className="border-border shadow-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    / {product.unit}
                  </span>
                </div>

                <Separator />

                {/* Quantity Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Jumlah
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-20 text-center"
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
                    <span className="font-medium text-foreground">
                      Total Harga:
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-primary hover:bg-primary-dark shadow-button text-lg py-6"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Tambah ke Keranjang
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product Benefits */}
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Manfaat & Keunggulan</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
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
            <CardTitle>Komposisi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nitrogen (N):</span>
              <span className="font-medium text-foreground">
                {product.composition.nitrogen}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fosfor (P):</span>
              <span className="font-medium text-foreground">
                {product.composition.phosphor}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kalium (K):</span>
              <span className="font-medium text-foreground">
                {product.composition.potassium}
              </span>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground">
              {product.composition.other}
            </p>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle>Spesifikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Berat:</span>
              <span className="font-medium text-foreground">
                {product.specifications.weight}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kemasan:</span>
              <span className="font-medium text-foreground">
                {product.specifications.packaging}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Penyimpanan:</span>
              <span className="font-medium text-foreground">
                {product.specifications.storage}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Masa Simpan:</span>
              <span className="font-medium text-foreground">
                {product.specifications.expiry}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Instructions */}
      <Card className="border-border shadow-card mt-6">
        <CardHeader>
          <CardTitle>Cara Penggunaan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {product.usage}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;
