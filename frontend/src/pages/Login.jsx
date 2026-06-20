import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await fetch("https://devlaunch-backend-uw21.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Invalid email or password parameter.");
      }

      localStorage.setItem("usuario_id", data.user.id);
      localStorage.setItem("usuario_nome", data.user.nome);
      localStorage.setItem("usuario_email", data.user.email);

      navigate("/dashboard");
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ backgroundColor: "var(--bg-card)", padding: "40px", borderRadius: "12px", border: "1px solid var(--border-subtle)", width: "100%", maxWidth: "400px" }}>
        <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: "0 0 8px 0" }}>Welcome back</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 24px 0" }}>Sign in to access your saved configuration pipelines.</p>

        {erro && <div style={{ color: "var(--error)", fontSize: "13px", marginBottom: "16px" }}>{erro}</div>}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-muted)", fontSize: "12px" }}>Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-premium" required />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-muted)", fontSize: "12px" }}>Password</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="input-premium" required />
          </div>

          <button type="submit" disabled={loading} className="btn-premium" style={{ marginTop: "8px" }}>
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "24px", textAlign: "center", margin: "24px 0 0 0" }}>
          Don't have an account? <Link to="/cadastro" style={{ color: "var(--accent-purple)", textDecoration: "none" }}>Register</Link>
        </p>
      </div>
    </div>
  );
}