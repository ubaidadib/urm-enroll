import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

interface NavDropdownItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
  external?: boolean;
}

interface NavDropdownProps {
  title: string;
  items: NavDropdownItem[];
  onNavigate?: (href: string) => void;
  isActive?: boolean;
}

/**
 * Modern navigation dropdown with smooth animations
 * Perfect for secondary navigation items
 */
export function NavDropdown({ title, items, onNavigate, isActive = false }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      <button
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-medium transition-all motion-fast ${
          isActive || isOpen
            ? "bg-background-hover text-text-primary border border-border/60"
            : "text-text-secondary hover:bg-background-hover hover:text-text-primary border border-transparent"
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform motion-fast ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className="absolute top-full mt-3 left-0 min-w-80 rounded-3xl border border-border/70 glass-card-medium z-50 overflow-hidden"
          >
            <div className="p-2.5 space-y-1.5">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (!item.external) {
                      e.preventDefault();
                      onNavigate?.(item.href);
                    }
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all group border ${
                    item.external
                      ? "border-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.35)] hover:bg-[rgba(212,175,55,0.05)]"
                      : "border-transparent hover:bg-background-hover hover:border-border/55"
                  }`}
                >
                  {item.icon && (
                    <div
                      className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-2xl transition-colors ${
                        item.external
                          ? "bg-[rgba(212,175,55,0.1)] text-[rgb(212,175,55)]"
                          : "bg-background-hover text-text-secondary group-hover:text-text-primary"
                      }`}
                    >
                      {item.icon}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium transition-colors ${
                        item.external ? "text-[rgb(212,175,55)]" : "text-text-primary"
                      }`}
                    >
                      {item.label}
                    </p>
                    {item.description && (
                      <p className="text-xs text-text-secondary line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.external ? (
                    <ExternalLink className="w-3.5 h-3.5 text-[rgba(212,175,55,0.6)]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-text-muted opacity-70 transition-transform group-hover:translate-x-0.5" />
                  )}
                  {item.badge && (
                    <span className="text-xs px-2 py-1 rounded-full bg-accent-tech/12 text-accent-tech font-medium shrink-0">
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
