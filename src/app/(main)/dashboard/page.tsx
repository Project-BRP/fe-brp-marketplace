// src/app/(main)/dashboard/page.tsx
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
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import Cart from "@/app/(main)/components/Cart";
import Checkout from "@/app/(main)/components/Checkout";
import FilterBar from "@/app/(main)/components/FilterBar";
import FilterModal, {
  AdvancedFilters,
} from "@/app/(main)/components/FilterModal";
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

type PageView = "catalog" | "product-detail" | "cart" | "checkout";

const initialAdvancedFilters: AdvancedFilters = {
  productTypeId: "Semua",
  packagingIds: [],
  minPrice: "",
  maxPrice: "",
};

const Index = () => {
  const [currentPageView, setCurrentPageView] = useState<PageView>("catalog");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(1);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(
    initialAdvancedFilters,
  );
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const {
    data: productData,
    isLoading,
    isError,
  } = useGetAllProducts({
    limit: 1000,
    search: debouncedSearchTerm,
    productTypeId: advancedFilters.productTypeId,
  });
  const { data: packagings = [], isLoading: isLoadingPackagings } =
    usePackagings();

  const clientFilteredProducts = useMemo(() => {
    const initialProducts = productData?.products ?? [];
    return initialProducts.filter((product) => {
      const { packagingIds, minPrice, maxPrice } = advancedFilters;
      const hasMatchingPackaging =
        packagingIds.length === 0 ||
        product.variants.some(
          (v) => v.packagingId && packagingIds.includes(v.packagingId),
        );
      if (!hasMatchingPackaging) return false;
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;
      const hasMatchingPrice = product.variants.some(
        (v) => v.priceRupiah >= min && v.priceRupiah <= max,
      );
      if (!hasMatchingPrice) return false;

      return true;
    });
  }, [productData, advancedFilters]);

  const paginatedProducts = useMemo(() => {
    const totalPages = Math.ceil(clientFilteredProducts.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const productsOnPage = clientFilteredProducts.slice(startIndex, endIndex);
    return { products: productsOnPage, totalPages };
  }, [clientFilteredProducts, page, limit]);

  const handleLimitChange = (value: string) => {
    setPage(1);
    setLimit(Number(value));
  };

  const handleResetFilters = () => {
    setPage(1);
    setAdvancedFilters(initialAdvancedFilters);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= paginatedProducts.totalPages) {
      setPage(newPage);
      document
        .querySelector("#catalog-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAddToCart = (itemToAdd: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.variantId === itemToAdd.variantId,
      );
      if (existingItem) {
        return prev.map((item) =>
          item.variantId === itemToAdd.variantId
            ? { ...item, quantity: item.quantity + itemToAdd.quantity }
            : item,
        );
      }
      return [...prev, itemToAdd];
    });
  };

  const handleUpdateQuantity = (variantId: string, quantity: number) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item,
      ),
    );
  const handleRemoveItem = (variantId: string) =>
    setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));

  const handleOrderSubmit = () => {
    alert("Pesanan berhasil dibuat!");
    setCartItems([]);
    setCurrentPageView("catalog");
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const renderCatalogContent = () => {
    if (isLoading || isLoadingPackagings) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] w-full rounded-xl" />
          ))}
        </div>
      );
    }
    if (isError)
      return (
        <div className="text-center py-12 text-red-500">
          Gagal memuat produk.
        </div>
      );
    if (paginatedProducts.products.length === 0)
      return (
        <div className="text-center py-12 text-muted-foreground">
          Tidak ada produk yang ditemukan.
        </div>
      );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            packagings={packagings}
            onViewDetail={(id) => {
              setSelectedProductId(id);
              setCurrentPageView("product-detail");
            }}
          />
        ))}
      </div>
    );
  };

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
          onAddToCart={handleAddToCart}
          packagings={packagings}
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
                Solusi Terbaik untuk{" "}
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
                  onClick={() =>
                    document
                      .querySelector("#catalog-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
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
      <section className="py-12 px-4 catalog-section" id="catalog-section">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Katalog Produk Pupuk NPK
            </h2>
            <p className="text-xl text-muted-foreground">
              Pilih pupuk yang sesuai dengan kebutuhan tanaman Anda
            </p>
          </div>

          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setPage(1);
              setSearchTerm(value);
            }}
            limit={limit}
            onLimitChange={handleLimitChange}
            onOpenFilterModal={() => setIsFilterModalOpen(true)}
          />

          <FilterModal
            isOpen={isFilterModalOpen}
            onOpenChange={setIsFilterModalOpen}
            filters={advancedFilters}
            onFilterChange={(newFilters) => {
              setPage(1);
              setAdvancedFilters((prev) => ({ ...prev, ...newFilters }));
            }}
            onReset={handleResetFilters}
          />

          <div className="mt-8 min-h-[400px]">{renderCatalogContent()}</div>

          {paginatedProducts.totalPages > 1 && !isLoading && !isError && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Sebelumnya
              </Button>
              <span className="text-sm font-medium">
                Halaman {page} dari {paginatedProducts.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === paginatedProducts.totalPages}
              >
                Berikutnya <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
