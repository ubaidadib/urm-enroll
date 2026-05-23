import { useMemo } from "react";
import { getVariant, type Variant } from "../utils/experiments";

/**
 * Synchronous experiment hook — reads variant from localStorage on first
 * render so the correct UI is painted immediately (no flicker).
 */
export function useExperiment(experimentId: string): {
  variant: Variant;
  isVariantB: boolean;
} {
  return useMemo(() => {
    const variant = getVariant(experimentId);
    return { variant, isVariantB: variant === "B" };
  }, [experimentId]);
}
