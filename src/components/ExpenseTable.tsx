import { useMemo, useState } from "react";
import type { Expense } from "../types";
import { EXPENSE_CATEGORIES } from "../types";

type SortKey = "date" | "category" | "amount";
type SortDir = "asc" | "desc";

interface Props {
  expenses: Expense[];
}

export default function ExpenseTable({ expenses }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (categoryFilter !== "All" && e.category !== categoryFilter) return false;
      if (startDate && e.date < startDate) return false;
      if (endDate && e.date > endDate) return false;
      return true;
    });
  }, [expenses, categoryFilter, startDate, endDate]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") cmp = a.date.localeCompare(b.date);
      else if (sortKey === "category") cmp = a.category.localeCompare(b.category);
      else cmp = a.amount - b.amount;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const total = sorted.reduce((sum, e) => sum + e.amount, 0);

  function sortIndicator(key: SortKey) {
    if (key !== sortKey) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  }

  return (
    <div className="expense-table-wrap">
      <div className="table-filters">
        <label>
          Category
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          From
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
      </div>

      <table className="expense-table">
        <thead>
          <tr>
            <th onClick={() => toggleSort("date")}>Date{sortIndicator("date")}</th>
            <th onClick={() => toggleSort("category")}>Category{sortIndicator("category")}</th>
            <th onClick={() => toggleSort("amount")} className="col-amount">
              Amount{sortIndicator("amount")}
            </th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && (
            <tr>
              <td colSpan={4} className="empty-row">
                No expenses found.
              </td>
            </tr>
          )}
          {sorted.map((e) => (
            <tr key={e.rowIndex}>
              <td>{e.date}</td>
              <td>
                <span className="category-badge">{e.category}</span>
              </td>
              <td className="col-amount">${e.amount.toFixed(2)}</td>
              <td>{e.description}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total</td>
            <td className="col-amount">${total.toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
