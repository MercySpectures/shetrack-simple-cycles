
import { Home, Calendar, Plus, Settings, Info } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function MobileNavbar() {
  const location = useLocation();
  
  const navItems = [
    { title: "Home", icon: Home, path: "/" },
    { title: "Calendar", icon: Calendar, path: "/calendar" },
    { title: "Add Period", icon: Plus, path: "/add-period" },
    { title: "About", icon: Info, path: "/about" },
    { title: "Settings", icon: Settings, path: "/settings" },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background px-4 flex items-center justify-around sm:px-6 z-10">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.title}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center px-2 py-1 rounded-md transition-colors",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive && "text-primary-foreground")} />
            <span className="text-xs mt-1">{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
