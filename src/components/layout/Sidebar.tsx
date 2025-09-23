import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  GraduationCap, 
  Building2, 
  LayoutDashboard, 
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Universités",
    href: "/universities",
    icon: GraduationCap,
  },
  {
    name: "Amphithéâtres", 
    href: "/amphitheaters",
    icon: Building2,
  },
  {
    name: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
];

// Hook personnalisé pour gérer useLocation de manière sûre
const useSafeLocation = () => {
  const [pathname, setPathname] = useState(window.location.pathname);
  
  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
    };
    
    // Écouter les changements de location
    window.addEventListener('popstate', handleLocationChange);
    
    // Utiliser une méthode plus directe pour les changements de route React Router
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      handleLocationChange();
    };
    
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      handleLocationChange();
    };
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);
  
  return { pathname };
};

interface SidebarProps {
  onToggle?: (isCollapsed: boolean) => void;
}

export const Sidebar = ({ onToggle }: SidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useSafeLocation();

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onToggle?.(newCollapsed);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 bg-gradient-card border-r border-border/50 backdrop-blur-sm transition-all duration-300 ease-in-out lg:translate-x-0",
        isCollapsed ? "w-20" : "w-64",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50 relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                  CampusWA
                </h1>
                <p className="text-xs text-muted-foreground">Admin Hub</p>
              </div>
            )}
            
            {/* Toggle button - only visible on desktop */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
              className={cn(
                "hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-background border border-border/50 hover:bg-accent z-10",
                isCollapsed && "right-1"
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronLeft className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href === "/amphitheaters" && location.pathname === "/amphitheaters");
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 group hover:shadow-card relative",
                        isCollapsed ? "px-2 py-3 justify-center mx-2" : "px-4 py-3",
                        isActive
                          ? "bg-gradient-primary text-white shadow-elegant"
                          : "text-foreground/70 hover:text-foreground hover:bg-accent/10"
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-foreground/50"
                      )} />
                      {!isCollapsed && item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          {!isCollapsed && (
            <div className="px-6 py-4 border-t border-border/50">
              <div className="text-xs text-muted-foreground text-center">
                CampusWA Admin v1.0
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};