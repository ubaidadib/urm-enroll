import { useState } from "react";
import { Monitor, Moon, Sun, Check } from "lucide-react";
import { useTheme } from "./theme-provider";

const themeOptions = [
  {
    value: "system",
    label: "System",
    icon: Monitor,
    preview: ["bg-brand-navy-800", "bg-brand-steel-500", "bg-brand-gold-500"],
  },
  {
    value: "light",
    label: "Light",
    icon: Sun,
    preview: ["bg-brand-navy-800", "bg-brand-teal-500", "bg-brand-gold-500"],
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
    preview: ["bg-brand-navy-950", "bg-brand-teal-400", "bg-brand-gold-400"],
  },
] as const;

type ThemeToggleProps = {
  iconOnly?: boolean;
};

export function ThemeToggle({ iconOnly = false }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme, themeSource } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const activeOption = themeOptions.find((option) => option.value === theme) ?? themeOptions[0];
  const ActiveIcon = activeOption.icon;
  const sourceLabel =
    themeSource === "system"
      ? `System theme (${resolvedTheme})`
      : `${resolvedTheme === "dark" ? "Dark" : "Light"} mode`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="theme-menu"
        aria-label={sourceLabel}
        title={sourceLabel}
        className={`group flex h-10 items-center rounded-full border border-border/65 bg-background-surface/88 hover:bg-background-hover hover:border-border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-tech/35 ${
          iconOnly ? "w-10 justify-center" : "gap-2 px-3"
        }`}
      >
        <ActiveIcon className="w-4 h-4 text-text-secondary group-hover:text-text-primary transition-colors" />
        {!iconOnly && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">{activeOption.label}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            id="theme-menu"
            role="menu"
            className="absolute right-0 top-full mt-3 w-44 rounded-3xl border border-border/70 glass-card-medium p-3 z-50"
          >
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = theme === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setTheme(option.value);
                    setIsOpen(false);
                  }}
                  role="menuitem"
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-background-hover text-text-primary border border-border/70"
                      : "text-text-secondary hover:text-text-primary hover:bg-background-hover border border-transparent"
                  }`}
                >
                  <span className="sr-only">{option.label}</span>
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-background-surface border border-border/50">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex items-center gap-1">
                    {option.preview.map((swatch) => (
                      <span
                        key={swatch}
                        className={`w-3 h-3 rounded-full border border-border/60 ${swatch}`}
                      />
                    ))}
                  </span>
                  {isActive && <Check className="w-4 h-4 text-text-primary" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
