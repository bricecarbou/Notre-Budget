// Le "mois" utilisé en interne (clé de requête) identifie une période par
// son jour de départ (ex: query month=6 avec startDay=27 → période
// 27 juin-26 juillet). Mais l'étiquette qu'on affiche doit être le mois où
// la période SE TERMINE, pas celui où elle commence — sinon une dépense
// du 19 juillet avec un début de mois au 27 semble "rangée en juin".
// Avec startDay=1 les deux mois coïncident, donc rien ne change pour le
// cas par défaut.
export function getDisplayPeriod(year: number, month: number, startDay: number) {
  const end = new Date(Date.UTC(year, month, startDay) - 1);
  return { year: end.getUTCFullYear(), month: end.getUTCMonth() + 1 };
}
