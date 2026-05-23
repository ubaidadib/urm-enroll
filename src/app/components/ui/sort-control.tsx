import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { ChevronDown } from "lucide-react";

export interface SortOption {
  label: string;
  value: string;
}

interface SortControlProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SortControl({ options, value, onChange }: SortControlProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className="relative min-w-56">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex min-h-11 w-full items-center justify-between rounded-lg border border-border bg-bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition-all motion-fast hover:border-border-strong focus-visible:ring-2 focus-visible:ring-accent-primary/30"
      >
        <span>{selected?.label}</span>
        <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open ? (
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="absolute right-0 z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-bg-surface shadow-xl"
          >
            <div className="p-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`inline-flex min-h-11 w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    option.value === value
                      ? "bg-accent-primary/10 font-semibold text-accent-primary"
                      : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
