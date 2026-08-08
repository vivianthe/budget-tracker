import type { Expense } from "../types";
import { getAccessToken } from "./googleAuth";

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID as string;
const SHEET_NAME = "Expenses";
const RANGE = `${SHEET_NAME}!A:D`;
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

function authHeaders() {
  const token = getAccessToken();
  if (!token) throw new Error("Not signed in to Google.");
  return { Authorization: `Bearer ${token}` };
}

async function handle(res: Response) {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets API error (${res.status}): ${body}`);
  }
  return res.json();
}

export async function getExpenses(): Promise<Expense[]> {
  const res = await fetch(`${BASE_URL}/values/${encodeURIComponent(RANGE)}`, {
    headers: authHeaders(),
  });
  const data = await handle(res);
  const rows: string[][] = data.values ?? [];
  // Skip header row (row 1)
  return rows.slice(1).map((row, i) => ({
    rowIndex: i + 2,
    date: row[0] ?? "",
    category: row[1] ?? "",
    amount: Number(row[2] ?? 0),
    description: row[3] ?? "",
  }));
}

export async function addExpense(expense: Omit<Expense, "rowIndex">): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/values/${encodeURIComponent(RANGE)}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        values: [[expense.date, expense.category, expense.amount, expense.description]],
      }),
    }
  );
  await handle(res);
}

export async function updateExpense(expense: Expense): Promise<void> {
  const range = `${SHEET_NAME}!A${expense.rowIndex}:D${expense.rowIndex}`;
  const res = await fetch(
    `${BASE_URL}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        values: [[expense.date, expense.category, expense.amount, expense.description]],
      }),
    }
  );
  await handle(res);
}
