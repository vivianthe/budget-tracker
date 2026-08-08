import SignInButton from "./SignInButton";

interface Props {
  loading: boolean;
  onSignIn: () => void;
}

const FEATURES = [
  "Sortable, filterable expense table",
  "Spend breakdown by category and month",
  "Synced straight to your own Google Sheet — no separate database",
];

export default function SignedOutView({ loading, onSignIn }: Props) {
  return (
    <div className="signed-out-wrap">
      <div className="signed-out-card">
        <div className="signed-out-icon" aria-hidden="true">
          💸
        </div>
        <h2>Track your spending, simply</h2>
        <p className="signed-out-subtitle">
          Sign in with Google to log expenses and see them summarized instantly.
        </p>
        <ul className="feature-list">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <SignInButton signedIn={false} loading={loading} onSignIn={onSignIn} onSignOut={() => {}} />
      </div>
    </div>
  );
}
