"use client";

import {
  ArrowLeft,
  Award,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Truck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import Cart from "@/app/(main)/components/Cart";
import Checkout from "@/app/(main)/components/Checkout";
import FilterBar from "@/app/(main)/components/FilterBar";
import ProductCard from "@/app/(main)/components/ProductCard";
import ProductDetail from "@/app/(main)/components/ProductDetail";
import { useGetAllProducts } from "@/app/(main)/hooks/useProduct";
import { usePackagings } from "@/app/admin/hooks/useMeta";
import { Badge } from "@/components/Badge";
import { Card, CardContent } from "@/components/Card";
import NextImage from "@/components/NextImage";
import { Skeleton } from "@/components/Skeleton";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import Navbar from "@/layouts/Navbar";
import { CartItem } from "@/types/order";
import { Product } from "@/types/product";

type PageView = "catalog" | "product-detail" | "cart" | "checkout";

const Index = () => {
  // --- Page View State ---
  const [currentPageView, setCurrentPageView] = useState<PageView>("catalog");
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  // --- Cart State ---
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // --- Filtering & Pagination State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Semua");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // --- Data Fetching ---
  const {
    data: productData,
    isLoading,
    isError,
  } = useGetAllProducts({
    page,
    limit,
    search: debouncedSearchTerm,
    productTypeId: selectedType,
  });
  const { data: packagings = [], isLoading: isLoadingPackagings } =
    usePackagings();

  // A separate query to get a full list for the detail page lookup.
  // This could be optimized later by fetching a single product by ID on the detail page.
  const { data: allProductsData } = useGetAllProducts({ limit: 1000 });

  // --- Derived State ---
  // Correctly extract products and pagination info from the new response structure
  const products = productData?.products ?? [];
  const totalPages = productData?.totalPages ?? 1;
  const currentPageNum = productData?.currentPage ?? 1;

  // --- Event Handlers ---
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      document
        .querySelector("#catalog-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFilterTypeChange = (value: string) => {
    setPage(1); // Reset to first page on filter change
    setSelectedType(value);
  };

  const handleSearchChange = (value: string) => {
    setPage(1); // Reset to first page on search
    setSearchTerm(value);
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
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
    setCurrentPageView("catalog");
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- Render Functions ---
  const renderCatalogContent = () => {
    if (isLoading || isLoadingPackagings) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] w-full rounded-xl" />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-12 text-red-500">
          Gagal memuat produk. Silakan coba lagi nanti.
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Tidak ada produk yang sesuai dengan filter yang dipilih.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            packagings={packagings}
            onViewDetail={(id) => {
              setSelectedProductId(id);
              setCurrentPageView("product-detail");
            }}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    );
  };

  // --- Page Render Logic ---
  if (currentPageView === "product-detail") {
    return (
      <>
        <Navbar
          cartItemCount={cartItemCount}
          onCartClick={() => setCurrentPageView("cart")}
        />
        <ProductDetail
          productId={selectedProductId}
          onBack={() => setCurrentPageView("catalog")}
          onAddToCart={(id, qty) => {
            const productList = allProductsData?.products ?? [];
            const product = productList.find((p) => p.id === id);
            if (product) handleAddToCart(product, qty);
          }}
        />
      </>
    );
  }

  if (currentPageView === "cart") {
    return (
      <div className="min-h-screen bg-gradient-earth">
        <Navbar
          cartItemCount={cartItemCount}
          onCartClick={() => setCurrentPageView("cart")}
        />
        <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
          <Button
            variant="ghost"
            onClick={() => setCurrentPageView("catalog")}
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
            onCheckout={() => setCurrentPageView("checkout")}
          />
        </div>
      </div>
    );
  }

  if (currentPageView === "checkout") {
    return (
      <div className="min-h-screen bg-gradient-earth">
        <Navbar
          cartItemCount={cartItemCount}
          onCartClick={() => setCurrentPageView("cart")}
        />
        <Checkout
          cartItems={cartItems}
          onBack={() => setCurrentPageView("cart")}
          onOrderSubmit={handleOrderSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navbar
        cartItemCount={cartItemCount}
        onCartClick={() => setCurrentPageView("cart")}
      />

      {/* Hero Section (Unchanged) */}
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

      {/* Features Section (Unchanged) */}
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

      {/* Products Catalog (Updated Section) */}
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

          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedType={selectedType}
            onTypeChange={handleFilterTypeChange}
          />

          <div className="mt-8 min-h-[400px]">{renderCatalogContent()}</div>

          {/* Pagination */}
          {totalPages > 1 && !isLoading && !isError && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={currentPageNum === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnya
              </Button>
              <span className="text-sm font-medium">
                Halaman {currentPageNum} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={currentPageNum === totalPages}
              >
                Berikutnya
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
