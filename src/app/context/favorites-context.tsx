import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const FAVORITES_STORAGE_ID = "urm-favorites-v1";

export type FavoriteEntityType = "university" | "program";

export type FavoriteUniversity = {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  type: "public" | "private" | "international";
  logo: string;
  coverPhoto: string;
  programsCount: number;
  languages: string[];
  established: number;
  ranking: number;
  description: string;
  website?: string;
};

export type FavoriteProgram = {
  id: string;
  name: string;
  degreeLevel: "bachelor" | "master" | "phd" | "certificate";
  field: string;
  duration: string;
  language: string;
  tuitionPerYear: number;
  tuitionCurrency?: string;
  description: string;
  requirements?: string[];
  universityId: string;
  universityName: string;
  universityLogo: string;
};

type FavoriteState = {
  universities: FavoriteUniversity[];
  programs: FavoriteProgram[];
};

type FavoritesContextValue = {
  favorites: FavoriteState;
  addFavorite: (type: FavoriteEntityType, item: FavoriteUniversity | FavoriteProgram) => void;
  removeFavorite: (type: FavoriteEntityType, id: string) => void;
  isFavorite: (type: FavoriteEntityType, id: string) => boolean;
  removeAllFavoritesByType: (type: FavoriteEntityType) => void;
  totalFavoritesCount: number;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

const initialState: FavoriteState = {
  universities: [],
  programs: [],
};

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteState>(initialState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_ID);
      if (!raw) return;
      const parsed = JSON.parse(raw) as FavoriteState;
      setFavorites({
        universities: Array.isArray(parsed.universities) ? parsed.universities : [],
        programs: Array.isArray(parsed.programs) ? parsed.programs : [],
      });
    } catch {
      setFavorites(initialState);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_STORAGE_ID, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((type: FavoriteEntityType, item: FavoriteUniversity | FavoriteProgram) => {
    setFavorites((current) => {
      if (type === "university") {
        if (current.universities.some((u) => u.id === item.id)) return current;
        return {
          ...current,
          universities: [...current.universities, item as FavoriteUniversity],
        };
      }

      if (current.programs.some((p) => p.id === item.id)) return current;
      return {
        ...current,
        programs: [...current.programs, item as FavoriteProgram],
      };
    });
  }, []);

  const removeFavorite = useCallback((type: FavoriteEntityType, id: string) => {
    setFavorites((current) => {
      if (type === "university") {
        return {
          ...current,
          universities: current.universities.filter((u) => u.id !== id),
        };
      }
      return {
        ...current,
        programs: current.programs.filter((p) => p.id !== id),
      };
    });
  }, []);

  const isFavorite = useCallback((type: FavoriteEntityType, id: string) => {
    if (type === "university") {
      return favorites.universities.some((u) => u.id === id);
    }
    return favorites.programs.some((p) => p.id === id);
  }, [favorites.programs, favorites.universities]);

  const removeAllFavoritesByType = useCallback((type: FavoriteEntityType) => {
    setFavorites((current) => {
      if (type === "university") {
        return { ...current, universities: [] };
      }
      return { ...current, programs: [] };
    });
  }, []);

  const totalFavoritesCount = favorites.universities.length + favorites.programs.length;

  const value = useMemo<FavoritesContextValue>(() => ({
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    removeAllFavoritesByType,
    totalFavoritesCount,
  }), [favorites, addFavorite, removeFavorite, isFavorite, removeAllFavoritesByType, totalFavoritesCount]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
