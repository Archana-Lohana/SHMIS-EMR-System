import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "../api";
import { ROLES } from "../auth";

export default function Login({ onSignedIn }) {
  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  

  async function submit(e) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      onSignedIn(await signIn(role, username, password));
    } catch (err) {
      setError(err.message || "Could not sign in. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="login">
      <section className="login-art">
        <span className="login-bar" aria-hidden />
        <h1>Sindh Health Management Information System &amp; Unified EMR Platform</h1>
        <p>One medical record for every patient, across every hospital in Sindh.</p>
      </section>

      <section className="login-panel">
        <form className="login-form" onSubmit={submit} noValidate>
          <h2>Log in</h2>

          <div className="role-pick" role="radiogroup" aria-label="Sign in as">
            {Object.entries(ROLES).map(([key, r]) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={role === key}
                className={role === key ? "on" : ""}
                onClick={() => { setRole(key); setError(""); }}
              >
                {r.label}
              </button>
            ))}
          </div>
          <p className="role-note">{ROLES[role].blurb}</p>

          <label className="login-label" htmlFor="user">Username</label>
          <input id="user" className="login-input" autoComplete="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />

          <label className="login-label" htmlFor="pass">Password</label>
          <div className="pass-wrap">
            <input id="pass" className="login-input" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="pass-eye" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button className="login-submit" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>

          
        </form>
      </section>
    </div>
  );
}
