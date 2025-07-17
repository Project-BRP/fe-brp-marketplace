"use client";
import { useState } from "react";
import ProductCard from "../components/ProductCard";

import Cart, { CartItem } from "../components/Cart";
import ProductDetail from "../components/ProductDetail";
import Checkout from "../components/Checkout";
import { Card, CardContent } from "@/components/Card";

import { Leaf, Truck, Award, Users } from "lucide-react";
// import heroImage from "@/assets/hero-fertilizer.jpg";
// import leafPattern from "@/assets/leaf-pattern.jpg";
import Button from "@/components/buttons/Button";
import { Badge } from "@/components/Badge";
import Navbar from "@/layouts/Navbar";
import FilterBar, { FilterOptions } from "../components/FilterBar";
import Typography from "@/components/Typography";
import NextImage from "@/components/NextImage";

type PageView = "catalog" | "product-detail" | "cart" | "checkout";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageView>("catalog");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    npkFormula: [],
    priceRange: { min: 0, max: 0 },
    searchTerm: "",
  });

  // Mock products data
  const allProducts = [
    {
      id: "1",
      name: "Pupuk NPK 15-15-15 Premium",
      npkFormula: "15-15-15",
      description:
        "Pupuk majemuk lengkap dengan kandungan seimbang untuk semua jenis tanaman",
      price: 125000,
      unit: "karung 50kg",
    },
    {
      id: "2",
      name: "Pupuk NPK 16-16-16 Super",
      npkFormula: "16-16-16",
      description:
        "Formula tinggi nitrogen untuk pertumbuhan vegetatif yang optimal",
      price: 135000,
      unit: "karung 50kg",
    },
    {
      id: "3",
      name: "Pupuk NPK 12-12-17 Khusus Buah",
      npkFormula: "12-12-17",
      description: "Tinggi kalium untuk pembungaan dan pembuahan yang maksimal",
      price: 130000,
      unit: "karung 50kg",
    },
    {
      id: "4",
      name: "Pupuk NPK 13-6-27 Potassium Plus",
      npkFormula: "13-6-27",
      description: "Tinggi kalium untuk tanaman buah dan sayuran",
      price: 140000,
      unit: "karung 50kg",
    },
    {
      id: "5",
      name: "Pupuk NPK 13-8-27-4 Complete",
      npkFormula: "13-8-27-4",
      description:
        "Formula lengkap dengan unsur mikro untuk hasil panen optimal",
      price: 150000,
      unit: "karung 50kg",
    },
    {
      id: "6",
      name: "Pupuk NPK 14-14-14 Standard",
      npkFormula: "14-14-14",
      description: "Pupuk serbaguna untuk berbagai jenis tanaman pertanian",
      price: 120000,
      unit: "karung 50kg",
    },
  ];

  // Filter products based on active filters
  const filteredProducts = allProducts.filter((product) => {
    const matchesNPK =
      filters.npkFormula.length === 0 ||
      filters.npkFormula.includes(product.npkFormula);
    const matchesPrice =
      (filters.priceRange.min === 0 ||
        product.price >= filters.priceRange.min) &&
      (filters.priceRange.max === 0 || product.price <= filters.priceRange.max);
    const matchesSearch =
      !filters.searchTerm ||
      product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      product.npkFormula.includes(filters.searchTerm);

    return matchesNPK && matchesPrice && matchesSearch;
  });

  const handleAddToCart = (productId: string, quantity: number = 1) => {
    const product = allProducts.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === productId);
      if (existingItem) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            npkFormula: product.npkFormula,
            price: product.price,
            unit: product.unit,
            quantity,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  interface OrderData {
    customerName: string;
    address: string;
    phoneNumber: string;
    items: CartItem[];
    totalPrice: number;
  }

  const handleOrderSubmit = () => {
    alert("Pesanan berhasil dibuat! Terima kasih telah berbelanja.");
    setCartItems([]);
    setCurrentPage("catalog");
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (currentPage === "product-detail") {
    return (
      <ProductDetail
        productId={selectedProductId}
        onBack={() => setCurrentPage("catalog")}
        onAddToCart={handleAddToCart}
      />
    );
  }

  if (currentPage === "cart") {
    return (
      <div className="min-h-screen bg-gradient-earth">
        <Navbar
          cartItemCount={cartItemCount}
          onCartClick={() => setCurrentPage("cart")}
        />
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Keranjang Belanja
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage("catalog")}
                className="mb-4 hover:bg-accent"
              >
                ← Lanjut Belanja
              </Button>
            </div>
            <div>
              <Cart
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={() => setCurrentPage("checkout")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === "checkout") {
    return (
      <div className="min-h-screen bg-gradient-earth">
        <Navbar
          cartItemCount={cartItemCount}
          onCartClick={() => setCurrentPage("cart")}
        />
        <Checkout
          cartItems={cartItems}
          onBack={() => setCurrentPage("cart")}
          onOrderSubmit={handleOrderSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navbar
        cartItemCount={cartItemCount}
        onCartClick={() => setCurrentPage("cart")}
      />

      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground w-fit"
              >
                Pupuk Berkualitas Premium
              </Badge>
              <Typography
                variant="h2"
                className="text-4xl lg:text-6xl font-bold text-foreground leading-tight"
              >
                Solusi Terbaik untuk
                <span className="text-primary"> Pertanian Modern</span>
              </Typography>
              <Typography
                variant="p"
                className="text-xl text-muted-foreground leading-relaxed"
              >
                PT. Bumi Rekayasa Persada menyediakan pupuk NPK berkualitas
                tinggi untuk meningkatkan produktivitas pertanian Anda.
              </Typography>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="green"
                  size="lg"
                  className="hover:bg-primary-dark shadow-button"
                  onClick={() => {
                    const catalogSection =
                      document.querySelector("#catalog-section");
                    catalogSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Leaf className="h-5 w-5 mr-2" />
                  Lihat Katalog
                </Button>
              </div>
            </div>
            <NextImage
              src="/dashboard/Hero.jpg"
              alt="Pupuk NPK Premium"
              className="rounded-2xl shadow-primary"
              imgClassName="object-cover w-full h-full rounded-2xl"
              width={800}
              height={600}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border shadow-card hover:shadow-primary transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Kualitas Terjamin
                </h3>
                <p className="text-muted-foreground">
                  Produk berkualitas tinggi dengan standar internasional
                </p>
              </CardContent>
            </Card>
            <Card className="border-border shadow-card hover:shadow-primary transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Pengiriman Cepat
                </h3>
                <p className="text-muted-foreground">
                  Pengiriman ke seluruh Indonesia dengan layanan terpercaya
                </p>
              </CardContent>
            </Card>
            <Card className="border-border shadow-card hover:shadow-primary transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Konsultasi Gratis
                </h3>
                <p className="text-muted-foreground">
                  Tim ahli siap membantu memilih pupuk yang tepat
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Catalog */}
      <section className="py-12 px-4 catalog-section" id="catalog-section">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Katalog Produk Pupuk NPK
            </h2>
            <p className="text-xl text-muted-foreground">
              Pilih pupuk yang sesuai dengan kebutuhan tanaman Anda
            </p>
          </div>

          {/* Filter Bar */}
          <FilterBar onFilterChange={setFilters} activeFilters={filters} />

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onViewDetail={(id) => {
                  setSelectedProductId(id);
                  setCurrentPage("product-detail");
                }}
                onAddToCart={(id) => handleAddToCart(id)}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Tidak ada produk yang sesuai dengan filter yang dipilih.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
