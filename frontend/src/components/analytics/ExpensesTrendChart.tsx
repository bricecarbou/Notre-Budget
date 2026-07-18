import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useChartTokens } from "@/lib/chartTokens";
import type { MonthlyTrendPoint } from "@/types";

const MONTH_LABELS_SHORT = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
];

function formatEuros(amount: number) {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function CustomTooltip({ active, payload, label }: any) {
  const tokens = useChartTokens();
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border border-slate-200 px-3 py-2 text-xs shadow-lg dark:border-slate-800"
      style={{ backgroundColor: tokens.surface, color: tokens.textPrimary }}
    >
      <div className="mb-1" style={{ color: tokens.textSecondary }}>
        {label}
      </div>
      <div className="font-semibold">{formatEuros(payload[0].value)}</div>
    </div>
  );
}

export function ExpensesTrendChart({ data }: { data: MonthlyTrendPoint[] }) {
  const tokens = useChartTokens();
  const chartData = data.map((d) => ({
    label: `${MONTH_LABELS_SHORT[d.month - 1]} ${String(d.year).slice(2)}`,
    totalDepenses: d.totalDepensesRecurrentes + d.totalDepensesPonctuelles,
  }));

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={tokens.gridline} strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: tokens.muted, fontSize: 11 }}
            axisLine={{ stroke: tokens.baseline }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: tokens.muted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={56}
            tickFormatter={(v) => formatEuros(v)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: tokens.baseline }} />
          <Line
            type="monotone"
            dataKey="totalDepenses"
            stroke={tokens.seriesPrimary}
            strokeWidth={2}
            dot={{ r: 4, fill: tokens.seriesPrimary, stroke: tokens.surface, strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
