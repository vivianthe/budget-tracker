export interface Expense {
  rowIndex: number; // 1-based row in the sheet (row 1 is header), used for updates
  date: string; // ISO date string, e.g. "2026-08-08"
  category: string;
  amount: number;
  description: string;
}

export const EXPENSE_CATEGORIES = [
  "Groceries",
  "Rent",
  "Utilities",
  "Transportation",
  "Dining",
  "Entertainment",
  "Health",
  "Shopping",
  "Other",
] as const;
