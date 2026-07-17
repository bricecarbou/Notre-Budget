export function Analytics() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Analyses</h1>
      <p className="text-sm text-slate-500">
        Graphiques d'évolution et répartition par catégorie — à implémenter (priorité 5).
        API disponible : <code>GET /api/analytics/monthly-trend</code>,{" "}
        <code>GET /api/analytics/by-category</code>.
      </p>
    </div>
  );
}
