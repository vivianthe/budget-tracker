import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { Expense } from "../types";

interface Props {
  expenses: Expense[];
}

const PALETTE = [
  "#4C6EF5",
  "#12B886",
  "#F59F00",
  "#E64980",
  "#7048E8",
  "#15AABF",
  "#FA5252",
  "#82C91E",
  "#868E96",
];

export default function SummaryCharts({ expenses }: Props) {
  const byCategory = useMemo(() => {
    const totals = new Map<string, number>();
    for (const e of expenses) {
      totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
    }
    return Array.from(totals.entries()).map(([category, amount]) => ({ category, amount }));
  }, [expenses]);

  const byMonth = useMemo(() => {
    const totals = new Map<string, number>();
    for (const e of expenses) {
      const month = e.date.slice(0, 7); // YYYY-MM
      totals.set(month, (totals.get(month) ?? 0) + e.amount);
    }
    return Array.from(totals.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));
  }, [expenses]);

  if (expenses.length === 0) return null;

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3>Spend by category</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={byCategory}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={(entry: { name?: string }) => entry.name ?? ""}
            >
              {byCategory.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [`$${Number(v ?? 0).toFixed(2)}`, "Amount"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Spend by month</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={byMonth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(v) => [`$${Number(v ?? 0).toFixed(2)}`, "Amount"]} />
            <Bar dataKey="amount" fill={PALETTE[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
