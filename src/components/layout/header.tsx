"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navigation } from "./navigation";
import { SearchInput } from "@/components/search";
import { ThemeToggle } from "@/components/accessibility";
import { FocusTrap } from "@/components/accessibility";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
  id?: string;
}

export function Header({ className, id }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      // Focus search input after animation
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }, 100);
    }
  };

  return (
    <motion.header
      id={id}
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
        isScrolled && "shadow-sm",
        className
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      role="banner"
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3 transition-transform duration-200 hover:scale-105"
          aria-label="Tulane AI & Data Science Division Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tulane-green text-white font-bold text-lg">
            T
          </div>
          <div className="hidden sm:block">
            <div className="text-lg font-bold text-tulane-green">
              Tulane.ai
            </div>
            <div className="text-xs text-muted-foreground">
              AI & Data Science Division
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:space-x-8">
          <Navigation />
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            aria-label="Search"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-enhanced"
          >
            <Search className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Button asChild className="focus-visible:ring-enhanced">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden focus-visible:ring-enhanced"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <FocusTrap active={isMobileMenuOpen}>
            <motion.div
              id="mobile-menu"
              className="lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
              role="dialog"
              aria-label="Mobile navigation menu"
            >
              <div className="border-t bg-background px-4 py-6 sm:px-6">
                <Navigation isMobile onItemClick={() => setIsMobileMenuOpen(false)} />
                <div className="mt-6 flex flex-col space-y-4">
                  <Button
                    variant="ghost"
                    className="justify-start focus-visible:ring-enhanced"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push('/search');
                    }}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                  <Button 
                    asChild 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="focus-visible:ring-enhanced"
                  >
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </FocusTrap>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <FocusTrap active={showSearch}>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearch(false)}
              role="dialog"
              aria-label="Search dialog"
              aria-modal="true"
            >
              <motion.div
                className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-background rounded-lg shadow-xl p-6 border">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2" id="search-dialog-title">
                      Search
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Find faculty, research, news, and resources
                    </p>
                  </div>
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSearch={handleSearch}
                    placeholder="Search..."
                    size="lg"
                    autoFocus
                    aria-describedby="search-dialog-title"
                  />
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => setShowSearch(false)}
                      className="text-sm focus-visible:ring-enhanced"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </FocusTrap>
        )}
      </AnimatePresence>
    </motion.header>
  );
}