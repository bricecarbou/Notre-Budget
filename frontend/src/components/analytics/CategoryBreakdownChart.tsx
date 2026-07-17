import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CATEGORICAL_COLORS, CHART_TOKENS } from "@/lib/chartTokens";
import type { CategoryBreakdown } from "@/types";

const MAX_SLICES = CATEGORICAL_COLORS.length;

function formatEuros(amount: number) {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function foldIntoSlices(breakdown: CategoryBreakdown[]) {
  if (breakdown.length <= MAX_SLICES) return breakdown;

  const head = breakdown.slice(0, MAX_SLICES - 1);
  const tail = breakdown.slice(MAX_SLICES - 1);
  const autresAmount = tail.reduce((sum, c) => sum + c.amount, 0);
  const autresPct = tail.reduce((sum, c) => sum + c.percentage, 0);

  return [
    ...head,
    {
      categoryId: "__autres__",
      categoryName: "Autres",
      color: null,
      amount: autresAmount,
      percentage: autresPct,
    },
  ];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div
      className="rounded-lg border border-slate-800 px-3 py-2 text-xs shadow-lg"
      style={{ backgroundColor: CHART_TOKENS.surface, color: CHART_TOKENS.textPrimary }}
    >
      <div className="font-semibold">{item.categoryName}</div>
      <div style={{ color: CHART_TOKENS.textSecondary }}>
        {formatEuros(item.amount)} · {item.percentage.toFixed(1)}%
      </div>
    </div>
  );
}

export function CategoryBreakdownChart({ breakdown }: { breakdown: CategoryBreakdown[] }) {
  if (breakdown.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        Aucune dépense sur ce mois.
      </p>
    );
  }

  const slices = foldIntoSlices(breakdown);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={slices}
            dataKey="amount"
            nameKey="categoryName"
            innerRadius="45%"
            outerRadius="75%"
            paddingAngle={2}
            stroke={CHART_TOKENS.surface}
            strokeWidth={2}
          >
            {slices.map((slice, i) => (
              <Cell key={slice.categoryId} fill={CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={48}
            formatter={(value) => <span style={{ color: CHART_TOKENS.textSecondary }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
