import { CategoryIcon } from "@/lib/categoryIcon";
import type { CategoryBreakdown } from "@/types";

function formatEuros(amount: number) {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function CategoryBreakdownTable({ breakdown }: { breakdown: CategoryBreakdown[] }) {
  if (breakdown.length === 0) return null;

  return (
    <table className="mt-4 w-full text-sm">
      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
        {breakdown.map((c) => (
          <tr key={c.categoryId}>
            <td className="py-2 pr-2">
              <span className="flex items-center gap-2">
                <CategoryIcon icon={c.icon} color={c.color} size={14} />
                {c.categoryName}
              </span>
            </td>
            <td className="py-2 text-right tabular-nums text-slate-500 dark:text-slate-400">
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
