import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Menu, X, Moon, Sun, Settings, Share2, Download, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';

interface HeaderProps {
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  onExportResults?: () => void;
  onShare?: () => void;
  onOpenSettings?: () => void;
}

export function Header({ 
  onThemeToggle, 
  isDarkMode = false, 
  onExportResults, 
  onShare, 
  onOpenSettings 
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Safe location hook usage with fallback
  let location;
  try {
    location = useLocation();
  } catch {
    // Fallback for when router context is not available
    location = { pathname: '/' };
  }

  const navigation = [
    { name: 'Analyze', href: '/', icon: Brain },
    { name: 'About', href: '/about', icon: Shield },
    { name: 'How It Works', href: '/how-it-works', icon: Settings },
    { name: 'API', href: '/api', icon: Share2 }
  ];

  const isActivePage = (href: string) => {
    if (!location) return false;
    if (href === '/') {
      return location.pathname === '/' || location.pathname === '/preview_page.html';
    }
    return location.pathname.startsWith(href);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TruthLens</h1>
              <p className="text-xs text-muted-foreground leading-none">AI-Powered Analysis</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePage(item.href);
              
              return (
                <div
                  key={item.name}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors relative cursor-pointer",
                    isActive
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = item.href;
                    }
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-muted rounded-md -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {onExportResults && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onExportResults}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            )}
            
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            )}

            {onOpenSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenSettings}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            )}

            {onThemeToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onThemeToggle}
                className="gap-2"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4" />
                    Light
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    Dark
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {onThemeToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onThemeToggle}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMenuToggle}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t bg-background"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePage(item.href);
                  
                  return (
                    <div
                      key={item.name}
                      onClick={() => {
                        handleLinkClick();
                        if (typeof window !== 'undefined') {
                          window.location.href = item.href;
                        }
                      }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                        isActive
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                      {isActive && <Badge variant="secondary" className="ml-auto">Active</Badge>}
                    </div>
                  );
                })}
                
                <div className="pt-4 border-t space-y-2">
                  {onExportResults && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onExportResults();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Results
                    </Button>
                  )}
                  
                  {onShare && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onShare();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Analysis
                    </Button>
                  )}

                  {onOpenSettings && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onOpenSettings();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      AI Settings
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}