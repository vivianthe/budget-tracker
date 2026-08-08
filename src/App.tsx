import { useCallback, useEffect, useState } from "react";
import "./App.css";
import type { Expense } from "./types";
import { signIn, signOut, isSignedIn } from "./lib/googleAuth";
import { getExpenses, addExpense } from "./lib/sheetsApi";
import SignInButton from "./components/SignInButton";
import SignedOutView from "./components/SignedOutView";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import SummaryCharts from "./components/SummaryCharts";

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoadingExpenses(true);
    setError(null);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses.");
    } finally {
      setLoadingExpenses(false);
    }
  }, []);

  useEffect(() => {
    if (signedIn) refresh();
  }, [signedIn, refresh]);

  async function handleSignIn() {
    setAuthLoading(true);
    setError(null);
    try {
      await signIn();
      setSignedIn(isSignedIn());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleSignOut() {
    signOut();
    setSignedIn(false);
    setExpenses([]);
  }

  async function handleAdd(expense: { date: string; category: string; amount: number; description: string }) {
    await addExpense(expense);
    await refresh();
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Budget Tracker</h1>
        {signedIn && (
          <SignInButton
            signedIn={signedIn}
            loading={authLoading}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
          />
        )}
      </header>

      {error && <p className="banner banner-error">{error}</p>}

      {!signedIn && <SignedOutView loading={authLoading} onSignIn={handleSignIn} />}

      {signedIn && (
        <>
          <ExpenseForm onAdd={handleAdd} />
          <SummaryCharts expenses={expenses} />
          {loadingExpenses ? (
            <p className="empty-state">Loading expenses...</p>
          ) : (
            <ExpenseTable expenses={expenses} />
          )}
        </>
      )}
    </div>
  );
}
