import { m } from "motion/react";
import { Heart } from "lucide-react";
import { useFavorites, type FavoriteEntityType, type FavoriteProgram, type FavoriteUniversity } from "@/app/context/favorites-context";

export function FavoriteButton({
  type,
  item,
  className = "",
}: {
  type: FavoriteEntityType;
  item: FavoriteUniversity | FavoriteProgram;
  className?: string;
}) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const saved = isFavorite(type, item.id);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (saved) {
      removeFavorite(type, item.id);
      return;
    }

    addFavorite(type, item);
  };

  return (
    <m.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.06 }}
      onClick={handleToggle}
      className={`inline-flex items-center justify-center rounded-full border transition-all ${
        saved
          ? "border-red-500/40 bg-red-500/10 text-red-500"
          : "border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300"
      } ${className}`}
      title={saved ? "Remove from Favorites" : "Save to Favorites"}
      aria-label={saved ? "Remove from Favorites" : "Save to Favorites"}
    >
      <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
    </m.button>
  );
}
