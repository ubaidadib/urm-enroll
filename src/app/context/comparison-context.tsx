import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "urm-comparison-programs-v1";
const MAX_COMPARE_ITEMS = 3;

export type ComparisonProgram = {
  id: string;
  name: string;
  degreeLevel: "bachelor" | "master" | "phd" | "certificate";
  duration: string;
  language: string;
  field: string;
  tuitionPerYear: number;
  requirements?: string[];
  universityId: string;
  universityName: string;
  universityLogo: string;
  deadline?: string;
  rating?: number;
};

type ComparisonContextValue = {
  items: ComparisonProgram[];
  toastMessage: string | null;
  addToComparison: (program: ComparisonProgram) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  isInComparison: (id: string) => boolean;
};

const ComparisonContext = createContext<ComparisonContextValue | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ComparisonProgram[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ComparisonProgram[];
      if (Array.isArray(parsed)) {
        setItems(parsed.slice(0, MAX_COMPARE_ITEMS));
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 2000);
  }, []);

  const isInComparison = useCallback((id: string) => {
    return items.some((item) => item.id === id);
  }, [items]);

  const addToComparison = useCallback((program: ComparisonProgram) => {
    setItems((current) => {
      if (current.some((item) => item.id === program.id)) {
        return current;
      }

      if (current.length >= MAX_COMPARE_ITEMS) {
        showToast("Maximum 3 programs for comparison");
        return current;
      }

      return [...current, program];
    });
  }, [showToast]);

  const removeFromComparison = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearComparison = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<ComparisonContextValue>(
    () => ({
      items,
      toastMessage,
      addToComparison,
      removeFromComparison,
      clearComparison,
      isInComparison,
    }),
    [items, toastMessage, addToComparison, removeFromComparison, clearComparison, isInComparison]
  );

  return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>;
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within ComparisonProvider");
  }
  return context;
}
