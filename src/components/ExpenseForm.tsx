import { useState } from "react";
import { EXPENSE_CATEGORIES } from "../types";

interface Props {
  onAdd: (expense: { date: string; category: string; amount: number; description: string }) => Promise<void>;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ onAdd }: Props) {
  const [date, setDate] = useState(today());
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!date || !category || !amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid date, category, and positive amount.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onAdd({ date, category, amount: parsedAmount, description });
      setAmount("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Amount
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label className="grow">
          Description
          <input
            type="text"
            placeholder="Optional note"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Expense"}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
