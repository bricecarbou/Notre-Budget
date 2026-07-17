import { CATEGORICAL_COLORS } from "@/lib/chartTokens";
import type { CategoryBreakdown } from "@/types";

function formatEuros(amount: number) {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function CategoryBreakdownTable({ breakdown }: { breakdown: CategoryBreakdown[] }) {
  if (breakdown.length === 0) return null;

  return (
    <table className="mt-4 w-full text-sm">
      <tbody className="divide-y divide-slate-800">
        {breakdown.map((c, i) => (
          <tr key={c.categoryId}>
            <td className="py-2 pr-2">
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORICAL_COLORS[i % CATEGORICAL_COLORS.length] }}
                />
                {c.categoryName}
              </span>
            </td>
            <td className="py-2 text-right tabular-nums text-slate-400">
              {c.percentage.toFixed(1)}%
            </td>
            <td className="py-2 pl-3 text-right tabular-nums font-medium">
              {formatEuros(c.amount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
