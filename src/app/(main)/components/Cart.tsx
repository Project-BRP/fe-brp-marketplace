import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Input } from "@/components/InputLovable";
import { Separator } from "@/components/Separator";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

export interface CartItem {
  id: string;
  name: string;
  npkFormula: string;
  price: number;
  unit: string;
  quantity: number;
  image?: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

const Cart = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(id);
    } else {
      onUpdateQuantity(id, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="border-border shadow-card">
        <CardContent className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Keranjang Kosong
          </h3>
          <p className="text-muted-foreground">
            Belum ada produk yang ditambahkan ke keranjang
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-start min-[400px]:items-center min-[360px]:flex-row flex-col gap-3">
            <div className="flex flex-row justify-center items-center">
              <ShoppingCart className="size-7 min-[400px]:size-5 mr-2 text-primary" />
              <Typography
                variant="h6"
                className="min-[400px]:text-2xl text-lg font-bold"
              >
                Keranjang Belanja
              </Typography>
            </div>
            <Badge variant="secondary" className="ml-2 bg-primary ">
              <Typography
                variant="p"
                className="text-base min-[400px]:text-sm md:text-sm text-primary-foreground"
              >
                {totalItems} item
              </Typography>
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-4 max-h-96 overflow-y-auto w-full">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 bg-accent rounded-lg w-full"
            >
              <div className="min-w-16 min-h-16 bg-muted rounded-lg flex items-center justify-center truncate">
                <span className="text-xs text-muted-foreground font-medium">
                  NPK
                </span>
              </div>

              <div className="w-full flex flex-col gap-4 sm:flex-row justify-start sm:justify-center items-start sm:items-center">
                <div className="flex-1 w-full flex flex-col gap-2 sm:gap-0">
                  <h4 className="font-medium text-foreground overflow-clip text-sm sm:text-xl">
                    {item.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    NPK {item.npkFormula}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {formatPrice(item.price)} / {item.unit}
                  </p>
                </div>

                <div className="flex flex-row gap-2 sm:gap-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-0 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="size-5 h-8 sm:size-8 p-0"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      <Minus className="size-2 p-0 sm:size-3" />
                    </Button>

                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id,
                          parseInt(e.target.value) || 1,
                        )
                      }
                      className="w-10 sm:w-16 text-center h-8"
                      min="1"
                      id={""}
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      className="size-5 h-8 sm:size-8 p-0"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      <Plus className="size-2 p-0 sm:size-3" />
                    </Button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Cart Summary */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Items:</span>
            <span className="font-medium text-foreground">
              {totalItems} item
            </span>
          </div>

          <div className="flex sm:flex-row flex-col justify-center gap-2 sm:justify-between items-center text-lg">
            <span className="font-semibold text-foreground">Total Harga:</span>
            <span className="font-bold text-primary text-2xl">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        <Separator />

        {/* Checkout Button */}
        <Button
          variant="green"
          className="w-full hover:bg-primary-dark shadow-button text-sm sm:text-lg py-6"
          onClick={onCheckout}
        >
          Lanjut ke Pembayaran
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default Cart;
