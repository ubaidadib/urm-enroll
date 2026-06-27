import { X } from "lucide-react";

export interface ActiveFilterChip {
  id: string;
  label: string;
  value: string;
}

interface ActiveFilterChipsProps {
  chips: ActiveFilterChip[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  clearAllLabel: string;
}

export function ActiveFilterChips({ chips, onRemove, onClearAll, clearAllLabel }: ActiveFilterChipsProps) {
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-bg-surface px-3 py-2 text-sm font-medium text-text-secondary"
        >
          <span className="text-text-muted">{chip.label}:</span>
          <span className="text-text-primary">{chip.value}</span>
          <button
            type="button"
            onClick={() => onRemove(chip.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg-surface-hover hover:text-text-primary"
            aria-label={`${chip.label} ${chip.value}`}
          >
            <X className="h-4 w-4" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="min-h-11 rounded-full px-3 py-2 text-sm font-semibold text-accent-primary-text transition-colors hover:text-accent-primary-hover"
      >
        {clearAllLabel}
      </button>
    </div>
  );
}
