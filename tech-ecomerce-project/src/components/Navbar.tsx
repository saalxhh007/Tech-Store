import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Heart, ShoppingCart, User, Menu, X, Search, ListOrdered, ClipboardListIcon } from 'lucide-react';
import { cn } from './../lib/utils';
import { useSelector } from "react-redux"
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const navLinks = [
    { name: 'Shop', href: '/categories/laptops' },
    { name: 'Contact Us', href: '/contact-us' },
    { name: 'About', href: '/about' },
    { name: 'Build My Collection', href: '/build-my-collection' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/categories/laptops' && location.pathname.startsWith('/categories')) {
      return true;
    }
    return location.pathname === href;
  };
  return (
    <nav className="bg-primary shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-cta text-cta-foreground px-3 py-1 rounded-lg font-bold text-lg">
              LaptopStore
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-primary-foreground hover:text-cta transition-colors duration-300 smooth-underline font-medium",
                  isActiveLink(link.href) && "text-cta"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side - Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center bg-primary-foreground/10 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-primary-foreground/60 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent text-primary-foreground placeholder:text-primary-foreground/60 border-none outline-none w-48"
              />
            </div>

            {/* Auth/Account Actions */}
            { isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:text-cta"
                  onClick={() => navigate("/my-account")}
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:text-cta"
                  onClick={() => navigate("/my-favorites")}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:text-cta relative"
                  onClick={() => navigate("/cart")}
                >
                  <ClipboardListIcon className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-cta text-cta-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:text-cta relative"
                  onClick={() => navigate("/my-orders")}
                >
                  <ListOrdered className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-cta text-cta-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    
                  </span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="hidden md:flex">
                  Login / Sign-up
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-primary border-t border-primary-foreground/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="flex items-center bg-primary-foreground/10 rounded-lg px-3 py-2 mb-3">
                <Search className="h-4 w-4 text-primary-foreground/60 mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent text-primary-foreground placeholder:text-primary-foreground/60 border-none outline-none w-full"
                />
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "block px-3 py-2 text-primary-foreground hover:text-cta transition-colors duration-300",
                    isActiveLink(link.href) && "text-cta bg-primary-foreground/10"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {!isAuthenticated && (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full mt-3">
                    Login / Sign-up
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;