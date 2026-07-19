import type { Category } from "@/types";

const CACHE_KEY = "notre-budget-categories-cache";

// Secours hors ligne : la grille de catégories a besoin de données pour
// être utilisable (sans catégorie sélectionnée, "Enregistrer" reste
// désactivé) — on garde donc la dernière liste connue en local.
export function saveCategoriesCache(categories: Category[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(categories));
  } catch {
    // quota localStorage dépassé ou indisponible : pas grave, juste pas de secours
  }
}

export function loadCategoriesCache(): Category[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
