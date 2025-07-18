import { Badge } from "@/components/Badge";
import Button from "@/components/buttons/Button";
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                B
              </span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm sm:text-xl font-bold text-foreground">
                PT. Bumi Rekayasa Persada Marketplace
              </h1>
              <p className=" text-sm text-muted-foreground">
                Pupuk Berkualitas untuk Pertanian Modern
              </p>
            </div>
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              className="relative hover:bg-accent"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-4 w-4 sm:mr-2" />
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
