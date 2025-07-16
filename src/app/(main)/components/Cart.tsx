import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import Button from "@/components/buttons/Button";
import { Badge } from "@/components/Badge";
import { Separator } from "@/components/Separator";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";

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
          <div className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
            Keranjang Belanja
            <Badge
              variant="secondary"
              className="ml-2 bg-primary text-primary-foreground"
            >
              {totalItems} item
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-accent rounded-lg"
            >
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground font-medium">
                  NPK
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                  {item.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  NPK {item.npkFormula}
                </p>
                <p className="text-sm font-medium text-primary">
                  {formatPrice(item.price)} / {item.unit}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                  }
                  className="w-16 text-center h-8"
                  min="1"
                  id={""}
                />

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                >
                  <Plus className="h-3 w-3" />
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

          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold text-foreground">Total Harga:</span>
            <span className="font-bold text-primary text-xl">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        <Separator />

        {/* Checkout Button */}
        <Button
          className="w-full bg-gradient-primary hover:bg-primary-dark shadow-button text-lg py-6"
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
