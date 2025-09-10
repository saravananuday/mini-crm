import { useRouter } from "next/router";
import { useState } from "react";
import { saveAuth } from "../utils/auth-client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok && data.token) {
      saveAuth(data.token, data.user);
      router.push("/dashboard");
    } else {
      alert(data.error || "Login failed");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Mini CRM</h1>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="hint">
          <p><strong>Test Accounts:</strong></p>
          <p>Manager → <code>mgr@demo.com / Manager@123</code></p>
          <p>Rep → <code>rep@demo.com / Rep@123</code></p>
        </div>
      </div>
    </div>
  );
}
