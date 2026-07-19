import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useChartTokens } from "@/lib/chartTokens";
import { FALLBACK_CATEGORY_COLOR } from "@/lib/categoryIcon";
import type { CategoryBreakdown } from "@/types";

const MAX_SLICES = 8;

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
      icon: null,
      color: FALLBACK_CATEGORY_COLOR,
      amount: autresAmount,
      percentage: autresPct,
    },
  ];
}

function CustomTooltip({ active, payload }: any) {
  const tokens = useChartTokens();
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div
      className="rounded-lg border border-slate-200 px-3 py-2 text-xs shadow-lg dark:border-slate-800"
      style={{ backgroundColor: tokens.surface, color: tokens.textPrimary }}
    >
      <div className="font-semibold">{item.categoryName}</div>
      <div style={{ color: tokens.textSecondary }}>
        {formatEuros(item.amount)} · {item.percentage.toFixed(1)}%
      </div>
    </div>
  );
}

export function CategoryBreakdownChart({
  breakdown,
  onSelectCategory,
}: {
  breakdown: CategoryBreakdown[];
  onSelectCategory?: (category: CategoryBreakdown) => void;
}) {
  const tokens = useChartTokens();

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
            stroke={tokens.surface}
            strokeWidth={2}
            onClick={(slice) => {
              if (slice.categoryId === "__autres__") return;
              onSelectCategory?.(slice as CategoryBreakdown);
            }}
            className={onSelectCategory ? "cursor-pointer" : undefined}
          >
            {slices.map((slice) => (
              <Cell key={slice.categoryId} fill={slice.color ?? FALLBACK_CATEGORY_COLOR} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={48}
            formatter={(value) => <span style={{ color: tokens.textSecondary }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
