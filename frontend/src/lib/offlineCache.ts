// Secours générique "dernière réponse connue" pour les lectures : quand le
// réseau est indisponible, on sert la dernière valeur mise en cache plutôt
// qu'un écran vide, avec l'horodatage pour que ce soit visible que ce n'est
// pas à jour.
export interface CacheEntry<T> {
  data: T;
  cachedAt: string;
}

export function saveToCache<T>(key: string, data: T) {
  try {
    const entry: CacheEntry<T> = { data, cachedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // quota localStorage dépassé ou indisponible : pas grave, juste pas de secours
  }
}

export function loadFromCache<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
