"use client";
import { Badge } from "@/components/Badge";
import { Card, CardContent } from "@/components/Card";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import Navbar from "@/layouts/Navbar";
import { CartItem } from "@/types/order";
import { ArrowLeft, Award, Leaf, Loader2, Truck, Users } from "lucide-react";
import { useState } from "react";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import FilterBar, { FilterOptions } from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import ProductDetail from "../components/ProductDetail";
import { useGetAllProducts } from "../hooks/useProduct";

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

  const { data: allProducts = [], isLoading, isError } = useGetAllProducts();

  // FIX: Updated filtering logic to use `variants` and handle undefined cases safely.
  const filteredProducts =
    allProducts?.filter((product) => {
      // Ensure product and its variants exist before filtering
      if (!product?.variants || product.variants.length === 0) {
        return false;
      }

      const matchesNPK =
        filters.npkFormula.length === 0 ||
        product.variants.some((v) =>
          filters.npkFormula.includes(v.composition),
        );

      const minPrice = Math.min(...product.variants.map((v) => v.priceRupiah));
      const maxPrice = Math.max(...product.variants.map((v) => v.priceRupiah));

      const matchesPrice =
        (filters.priceRange.min === 0 || maxPrice >= filters.priceRange.min) &&
        (filters.priceRange.max === 0 || minPrice <= filters.priceRange.max);

      const matchesSearch =
        !filters.searchTerm ||
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.variants.some((v) =>
          v.composition.includes(filters.searchTerm),
        );

      return matchesNPK && matchesPrice && matchesSearch;
    }) ?? []; // Default to an empty array if allProducts is not an array

  const handleAddToCart = (productId: string, quantity: number = 1) => {
    const product = allProducts.find((p) => p.id === productId);
    // FIX: Use `variants` and check for its existence
    if (!product?.variants?.length) return;

    const mainVariant = product.variants[0];

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === mainVariant.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === mainVariant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        return [
          ...prev,
          {
            id: mainVariant.id,
            name: product.name,
            npkFormula: mainVariant.composition,
            price: mainVariant.priceRupiah,
            unit: mainVariant.weight,
            quantity,
            image: mainVariant.imageUrl,
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

  const handleOrderSubmit = () => {
    alert("Pesanan berhasil dibuat! Terima kasih telah berbelanja.");
    setCartItems([]);
    setCurrentPage("catalog");
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (currentPage === "product-detail") {
    return (
      <>
        <Navbar
          cartItemCount={cartItemCount}
          onCartClick={() => setCurrentPage("cart")}
        />
        <ProductDetail
          productId={selectedProductId}
          onBack={() => setCurrentPage("catalog")}
          onAddToCart={handleAddToCart}
        />
      </>
    );
  }

  if (currentPage === "cart") {
    return (
      <div className="min-h-screen bg-gradient-earth">
        <Navbar
          cartItemCount={cartItemCount}
          onCartClick={() => setCurrentPage("cart")}
        />
        <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage("catalog")}
            className="hover:bg-accent border rounded-full flex flex-row items-center justify-center gap-3 p-4 w-fit"
          >
            <ArrowLeft className="size-5" />
            <Typography
              variant="p"
              className="hidden min-[400px]:block text-sm font-semibold text-foreground"
            >
              Kembali ke Katalog
            </Typography>
          </Button>

          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => setCurrentPage("checkout")}
          />
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
                className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl font-bold text-foreground leading-tight"
              >
                Solusi Terbaik untuk
                <span className="text-primary"> Pertanian Modern</span>
              </Typography>
              <Typography
                variant="p"
                className="sm:text-xl md:text-xl text-base text-muted-foreground leading-relaxed"
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

          <FilterBar onFilterChange={setFilters} activeFilters={filters} />

          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}

          {isError && (
            <div className="text-center py-12 text-red-500">
              Gagal memuat produk. Silakan coba lagi nanti.
            </div>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetail={(id) => {
                    setSelectedProductId(id);
                    setCurrentPage("product-detail");
                  }}
                  onAddToCart={(id) => handleAddToCart(id)}
                />
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
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
