import type { ReactNode } from "react";
import { useRef, useEffect } from "react";
import { AnimatePresence, m } from "motion/react";
import { X } from "lucide-react";

interface FilterDrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onApply: () => void;
  onClearAll: () => void;
  applyLabel: string;
  clearAllLabel: string;
  children: ReactNode;
}

export function FilterDrawer({
  open,
  title,
  onClose,
  onApply,
  onClearAll,
  applyLabel,
  clearAllLabel,
  children,
}: FilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap: manage focus when drawer opens/closes
  useEffect(() => {
    if (open) {
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Move focus to first focusable element in drawer
      const focusableElements = drawerRef.current?.querySelectorAll(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (focusableElements?.length) {
        (focusableElements[0] as HTMLElement).focus();
      }
    } else if (previousFocusRef.current) {
      // Restore focus when drawer closes
      previousFocusRef.current.focus();
    }
  }, [open]);

  // Keyboard event handler for focus trap
  useEffect(() => {
    if (!open || !drawerRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusableElements = drawerRef.current!.querySelectorAll(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      const activeElement = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        // Shift+Tab: cycle backwards
        if (activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab: cycle forwards
        if (activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-80 lg:hidden" role="dialog" aria-modal="true" aria-label={title}>
          <m.button
            type="button"
            aria-label={title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 bg-ink/55"
            onClick={onClose}
          />

          <m.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute right-0 top-0 h-full w-full max-w-md border-l border-border bg-bg-surface shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="text-lg font-bold text-text-primary">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close filters"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:bg-bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-4">{children}</div>
              </div>

              <div className="sticky bottom-0 border-t border-border bg-bg-surface px-4 py-4 space-y-3">
                <button
                  type="button"
                  onClick={onApply}
                  className="w-full inline-flex min-h-11 items-center justify-center rounded-lg bg-accent-primary px-4 py-3 text-sm font-semibold text-ink transition-all hover:shadow-lg hover:shadow-accent-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                >
                  {applyLabel}
                </button>
                <button
                  type="button"
                  onClick={onClearAll}
                  className="w-full inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                >
                  {clearAllLabel}
                </button>
              </div>
            </div>
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
