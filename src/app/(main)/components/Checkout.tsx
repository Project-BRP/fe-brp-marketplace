import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Input } from "@/components/InputLovable";
import { RadioGroup, RadioGroupItem } from "@/components/RadioGroup";
import { Separator } from "@/components/Separator";
import { Textarea } from "@/components/TextArea";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import { ArrowLeft, CreditCard, MapPin, Truck, User } from "lucide-react";
import { useState } from "react";
import { CartItem } from "./Cart";

interface CheckoutProps {
  cartItems: CartItem[];
  onBack: () => void;
  onOrderSubmit: (orderData: OrderData) => void;
}

interface OrderData {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    postalCode: string;
    province: string;
    notes?: string;
    method: string;
  };
  payment: {
    method: string;
  };
  items: CartItem[];
  summary: {
    subtotal: number;
    shippingCost: number;
    total: number;
  };
}

const Checkout = ({ cartItems, onBack, onOrderSubmit }: CheckoutProps) => {
  const [formData, setFormData] = useState({
    // Customer Info
    name: "",
    email: "",
    phone: "",

    // Shipping Address
    address: "",
    city: "",
    postalCode: "",
    province: "",
    notes: "",

    // Payment & Shipping
    paymentMethod: "bank-transfer",
    shippingMethod: "standard",
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = formData.shippingMethod === "express" ? 100000 : 50000;
  const total = subtotal + shippingCost;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      shipping: {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        province: formData.province,
        notes: formData.notes,
        method: formData.shippingMethod,
      },
      payment: {
        method: formData.paymentMethod,
      },
      items: cartItems,
      summary: {
        subtotal,
        shippingCost,
        total,
      },
    };

    onOrderSubmit(orderData);
  };

  const paymentMethods = [
    {
      id: "bank-transfer",
      name: "Transfer Bank",
      desc: "BCA, Mandiri, BNI, BRI",
    },
    { id: "cod", name: "Cash on Delivery", desc: "Bayar saat barang diterima" },
    { id: "ewallet", name: "E-Wallet", desc: "GoPay, OVO, DANA, LinkAja" },
  ];

  const shippingMethods = [
    {
      id: "standard",
      name: "Pengiriman Standar",
      desc: "3-5 hari kerja",
      cost: 50000,
    },
    {
      id: "express",
      name: "Pengiriman Express",
      desc: "1-2 hari kerja",
      cost: 100000,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-accent">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Keranjang
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
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
                    <label htmlFor="name">Nama Lengkap *</label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone">Nomor Telepon *</label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="08xxxxxxxxxx"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="email@example.com"
                  />
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
                <div className="space-y-2">
                  <label htmlFor="address">Alamat Lengkap *</label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e: { target: { value: string } }) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city">Kota/Kabupaten *</label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="Nama kota"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="postalCode">Kode Pos *</label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) =>
                        handleInputChange("postalCode", e.target.value)
                      }
                      placeholder="12345"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="province">Provinsi *</label>
                    <Input
                      id="province"
                      value={formData.province}
                      onChange={(e) =>
                        handleInputChange("province", e.target.value)
                      }
                      placeholder="Nama provinsi"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes">Catatan Tambahan</label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e: { target: { value: string } }) =>
                      handleInputChange("notes", e.target.value)
                    }
                    placeholder="Instruksi khusus untuk pengiriman (opsional)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card className="border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  <Typography
                    variant="h6"
                    className="min-[400px]:text-2xl text-lg font-bold"
                  >
                    Metode Pengiriman
                  </Typography>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.shippingMethod}
                  onValueChange={(value: string) =>
                    handleInputChange("shippingMethod", value)
                  }
                >
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-accent"
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="flex-1">
                        <label
                          htmlFor={method.id}
                          className="flex justify-between cursor-pointer"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {method.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {method.desc}
                            </p>
                          </div>
                          <span className="font-medium text-primary">
                            {formatPrice(method.cost)}
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  <Typography
                    variant="h6"
                    className="min-[400px]:text-2xl text-lg font-bold"
                  >
                    Metode Pembayaran
                  </Typography>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value: string) =>
                    handleInputChange("paymentMethod", value)
                  }
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-accent"
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="flex-1">
                        <label htmlFor={method.id} className="cursor-pointer">
                          <p className="font-medium text-foreground">
                            {method.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {method.desc}
                          </p>
                        </label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Order Summary */}
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
              {/* Order Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start gap-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        NPK {item.npkFormula}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium text-foreground text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ongkos Kirim:</span>
                  <span className="text-foreground">
                    {formatPrice(shippingCost)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total:</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>

              {/* Submit Button */}
              <Button
                variant="green"
                type="submit"
                onClick={handleSubmit}
                className="w-full  hover:bg-primary-dark shadow-button text-lg py-6"
              >
                Buat Pesanan
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
};

export default Checkout;
