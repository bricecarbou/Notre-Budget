// `startDay` décale le début (et donc la fin) de la période — ex: 27 pour un
// budget qui court du 27 au 26 du mois suivant plutôt que du 1er au dernier
// jour du mois. Par défaut (1), équivaut au mois calendaire classique.
export function monthRange(year: number, month: number, startDay = 1) {
  const start = new Date(Date.UTC(year, month - 1, startDay, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, startDay, 0, 0, 0) - 1);
  return { start, end };
}

export function shiftMonth(year: number, month: number, offset: number) {
  const d = new Date(Date.UTC(year, month - 1 + offset, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}
