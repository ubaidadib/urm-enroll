import { useState } from "react";

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loading?: "eager" | "lazy";
};

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc = "/placeholder-image.svg",
  loading = "lazy",
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
