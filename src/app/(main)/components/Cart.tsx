import {
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/app/(main)/hooks/useCart";
import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Input } from "@/components/InputLovable";
import NextImage from "@/components/NextImage";
import { Separator } from "@/components/Separator";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import { CartItem } from "@/types/cart";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
interface CartProps {
  items: CartItem[];
  onCheckout: () => void;
}

const Cart = ({ items, onCheckout }: CartProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };
  const { mutate: updateQuantity } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();
  const totalPrice = items.reduce(
    (sum, item) => sum + item.productVariant.priceRupiah * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const { mutate: clearCart } = useClearCart();
  const handleQuantityChange = (
    cartItemId: string,
    newQuantity: number,
    itemQuantity: number,
  ) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
    } else {
      updateQuantity({
        cartItemId,
        payload: { quantity: newQuantity - itemQuantity },
      });
    }
  };

  const handleClearCart = async () => {
    await clearCart();
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
          <Button variant="red" onClick={handleClearCart}>
            <Trash2 className="h-4 w-4 mr-2" />
            Kosongkan Keranjang
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-4 max-h-96 overflow-y-auto w-full">
          {items.map((item) => (
            <div
              key={item.productVariant.id}
              className="flex items-start gap-4 p-4 bg-accent rounded-lg w-full"
            >
              <NextImage
                src={item.productVariant.imageUrl ?? "/dashboard/Hero.jpg"}
                alt={item.productVariant.product.name}
                width={64}
                height={64}
                className="min-w-16 h-16 bg-muted rounded-lg"
                imgClassName="object-cover w-full h-full rounded-lg"
              />

              <div className="w-full flex flex-col gap-4 sm:flex-row justify-start sm:justify-center items-start sm:items-center">
                <div className="flex-1 w-full flex flex-col gap-2 sm:gap-0">
                  <h4 className="font-medium text-foreground overflow-clip text-sm sm:text-xl">
                    {item.productVariant.product.name}
                  </h4>
                  <p className="text-sm font-medium text-primary">
                    {formatPrice(item.productVariant.priceRupiah)} /
                    {item.productVariant.packaging
                      ? item.productVariant.packaging.name
                      : "Pcs"}
                    ({item.productVariant.weight_in_kg} kg)
                  </p>
                  {item.productVariant.isDeleted ||
                    (item.productVariant.product.isDeleted && (
                      <Typography variant="p" className="text-red-500">
                        {item.productVariant.isDeleted
                          ? "Produk Variant tidak ada, silahkan cari variant lain"
                          : "Produk tidak ada, silahkan cari produk lain"}
                      </Typography>
                    ))}
                </div>

                <div className="flex flex-row gap-2 sm:gap-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-0 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="size-5 h-8 sm:size-8 p-0"
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.quantity - 1,
                          item.quantity,
                        )
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
                          item.quantity,
                        )
                      }
                      className="w-10 sm:w-16 text-center h-8"
                      min="1"
                      id={`qty-${item.productVariantId}`}
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      className="size-5 h-8 sm:size-8 p-0"
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.quantity + 1,
                          item.quantity,
                        )
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
                    onClick={() => removeItem(item.id)}
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
          disabled={items.some(
            (item) =>
              item.productVariant.isDeleted ||
              item.productVariant.product.isDeleted,
          )}
        >
          Lanjut ke Pembayaran
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
        {items.some(
          (item) =>
            item.productVariant.isDeleted ||
            item.productVariant.product.isDeleted,
        ) && (
          <Typography variant="p" className="text-red-500 text-center">
            Beberapa produk tidak tersedia, silahkan hapus atau ganti produk
            tersebut untuk melanjutkan pembayaran.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default Cart;
