import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-bg-secondary/85 border border-border/35 ${className}`}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(var(--bg-surface), 0) 0%, rgba(var(--accent-tech), 0.2) 50%, rgba(var(--bg-surface), 0) 100%)",
          animation: "skeleton-shimmer 1.4s ease-in-out infinite",
          transform: "translateX(-100%)",
        }}
      />
    </div>
  );
}

export function ProgramCardSkeleton() {
  return (
    <div className="h-full min-h-[360px] rounded-2xl border border-border/60 bg-bg-surface/85 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-4 w-32 rounded-md" />
      </div>

      <Skeleton className="mb-3 h-7 w-5/6 rounded-md" />
      <Skeleton className="mb-6 h-6 w-28 rounded-full" />

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>

      <div className="mb-4 h-px bg-border/60" />

      <div className="mb-5 flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-7 w-20 rounded-md" />
        </div>
        <Skeleton className="h-5 w-12 rounded-md" />
      </div>

      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  );
}

export function UniversityCardSkeleton() {
  return (
    <div className="h-full rounded-2xl border border-border/60 bg-bg-surface/85 overflow-hidden backdrop-blur-sm">
      <Skeleton className="h-48 w-full rounded-none" />

      <div className="p-5">
        <Skeleton className="mb-3 h-7 w-11/12 rounded-md" />
        <Skeleton className="mb-5 h-4 w-2/3 rounded-md" />

        <div className="mb-4 space-y-2">
          <Skeleton className="h-3 w-24 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-6 w-12 rounded-md" />
          </div>
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
