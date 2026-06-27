import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { ChevronDown, X } from "lucide-react";

export interface FilterItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface FilterPanelProps {
  title: string;
  items: FilterItem[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  collapsible?: boolean;
  multiSelect?: boolean;
}

/**
 * Modern, reusable filter panel component
 * Supports single/multi-select with smooth animations
 * Gen Z design: clean, interactive, gradient backgrounds
 */
export function FilterPanel({
  title,
  items,
  selected,
  onSelect,
  collapsible = true,
  multiSelect = false,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const selectedArray = multiSelect && Array.isArray(selected) ? (selected as string[]) : [];

  return (
    <div className="rounded-xl bg-bg-surface border border-border overflow-hidden">
      {/* Header */}
      {collapsible && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-bg-surface-hover transition-colors"
        >
          <h3 className="font-bold text-text-primary text-sm uppercase tracking-wide">
            {title}
          </h3>
          <ChevronDown
            className={`w-4 h-4 text-text-muted transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {!collapsible && (
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-bold text-text-primary text-sm uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}

      {/* Items */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/70"
          >
            <div className="p-3 space-y-2">
              {items.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer group hover:bg-bg-surface-hover transition-colors"
                >
                  <input
                    type={multiSelect ? "checkbox" : "radio"}
                    name={title}
                    checked={
                      multiSelect
                        ? selectedArray.includes(item.id)
                        : selected === item.id
                    }
                    onChange={() => {
                      if (multiSelect) {
                        // Handle multi-select
                        const newSelected = selectedArray.includes(item.id)
                          ? selectedArray.filter((id) => id !== item.id)
                          : [...selectedArray, item.id];
                        onSelect(newSelected as any);
                      } else {
                        onSelect(selected === item.id ? null : item.id);
                      }
                    }}
                    className="w-4 h-4 rounded cursor-pointer accent-accent-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-text-secondary group-hover:text-accent-primary-text transition-colors">
                      {item.label}
                    </span>
                    {item.count !== undefined && (
                      <span className="text-xs text-text-muted ml-1">
                        ({item.count})
                      </span>
                    )}
                  </div>
                  {item.icon && (
                    <div className="flex-shrink-0 text-text-muted group-hover:text-accent-primary-text transition-colors">
                      {item.icon}
                    </div>
                  )}
                </label>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Compact filter bar for mobile/inline display
 */
export function FilterBar({
  label,
  value,
  options,
  onChange,
  onClear,
}: {
  label: string;
  value: string | null;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  onClear?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
          value
            ? "border-accent-primary bg-accent-primary/5 text-accent-primary-text font-medium"
            : "border-border text-text-secondary"
        }`}
      >
        <span className="text-sm">{label}</span>
        {value && <span className="text-xs font-bold">: {value}</span>}
        <ChevronDown className="w-4 h-4 ml-auto" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 left-0 right-0 bg-bg-surface border border-border rounded-xl shadow-lg z-50"
          >
            <div className="p-2">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    value === opt.value
                      ? "bg-accent-primary/10 text-accent-primary-text font-medium"
                      : "text-text-secondary hover:bg-bg-surface-hover"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {value && (
              <div className="px-2 py-2 border-t border-border">
                <button
                  onClick={() => {
                    onClear?.();
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-surface-hover transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Clear Filter
                </button>
              </div>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
