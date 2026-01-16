import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  favoritesCount: number;
}

const Header = ({ favoritesCount }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              ЦИАН
            </h1>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
                Купить
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
                Снять
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
                Новостройки
              </a>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden sm:flex">
              Разместить объявление
            </Button>
            
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Heart className="w-6 h-6 text-muted-foreground" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cian-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
