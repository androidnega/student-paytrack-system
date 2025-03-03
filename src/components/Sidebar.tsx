
import { useAuth } from "@/contexts/AuthContext";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  // Filter navigation items based on user role
  const filteredNavItems = NAV_ITEMS.filter((item) =>
    hasPermission(item.requiredRoles)
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-10 w-64 bg-white dark:bg-sidebar shadow-md transition-transform duration-300 ease-in-out transform",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {user?.name.charAt(0)}
            </div>
            {open && (
              <div className="flex flex-col md:opacity-100 transition-opacity duration-200">
                <span className="font-medium text-sm">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.role}</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {filteredNavItems.map((item) => {
              // Get dynamic icon from Lucide
              const IconComponent = (Icons as Record<string, LucideIcon>)[
                item.icon.charAt(0).toUpperCase() + item.icon.slice(1)
              ];

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200",
                      "hover:bg-muted",
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground/70"
                    )}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {open && (
                      <span className="truncate md:opacity-100 transition-opacity duration-200">
                        {item.title}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 mt-auto">
          <div
            className={cn(
              "p-2 bg-muted/50 rounded-md text-sm flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            )}
          >
            <Icons.LogOut className="w-5 h-5" />
            {open && (
              <span className="md:opacity-100 transition-opacity duration-200">
                Log Out
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
