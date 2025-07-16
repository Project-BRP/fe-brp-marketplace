import { Badge } from "@/components/Badge";
import Button from "@/components/buttons/Button";
import { Input } from "@/components/InputLovable";
import { ShoppingCart, Search, Menu } from "lucide-react";

interface NavbarProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

const Navbar = ({ cartItemCount = 0, onCartClick }: NavbarProps) => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                B
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                PT. Bumi Rekayasa Persada Marketplace
              </h1>
              <p className="text-sm text-muted-foreground">
                Pupuk Berkualitas untuk Pertanian Modern
              </p>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari pupuk NPK (contoh: 15-15-15)"
                className="pl-10 border-border focus:ring-primary"
                id={""}
              />
            </div>
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              className="relative hover:bg-accent"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Keranjang</span>
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              placeholder="Cari pupuk NPK..."
              className="pl-10 border-border focus:ring-primary"
              id={""}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
