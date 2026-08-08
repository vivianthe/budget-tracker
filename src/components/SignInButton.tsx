interface Props {
  signedIn: boolean;
  loading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function SignInButton({ signedIn, loading, onSignIn, onSignOut }: Props) {
  if (signedIn) {
    return (
      <button className="btn btn-secondary" onClick={onSignOut}>
        Sign out
      </button>
    );
  }
  return (
    <button className="btn btn-primary" onClick={onSignIn} disabled={loading}>
      {loading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
}
