import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Login() {
  const { signIn } = useAuthActions();

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn("password", {
        flow: mode,      // "signIn" sau "signUp"
        email,
        password,
      });
    } catch (err: any) {
      setError(err?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 360 }}>
      <h2>{mode === "signIn" ? "Sign in" : "Create account"}</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          autoComplete={mode === "signIn" ? "current-password" : "new-password"}
        />

        <button disabled={busy} type="submit">
          {busy ? "..." : mode === "signIn" ? "Sign in" : "Sign up"}
        </button>

        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>

      <div style={{ marginTop: 12 }}>
        {mode === "signIn" ? (
          <button type="button" onClick={() => setMode("signUp")}>
            Need an account? Sign up
          </button>
        ) : (
          <button type="button" onClick={() => setMode("signIn")}>
            Already have an account? Sign in
          </button>
        )}
      </div>
    </div>
  );
}