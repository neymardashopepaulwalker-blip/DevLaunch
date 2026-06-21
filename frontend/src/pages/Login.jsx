import { useState } from "react";
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
      if (!response.ok) throw new Error(data.erro || "Invalid authentication credentials.");

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
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ backgroundColor: "var(--bg-card)", padding: "40px", border: "1px solid var(--border-glow)", width: "100%", maxWidth: "400px", borderRadius: "12px" }}>
        <h2 style={{ color: "#fff", fontSize: "22px", margin: "0 0 8px 0", fontWeight: "600" }}>Account Sign In</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 24px 0" }}>Access your workspace parameters.</p>
        
        {erro && <div style={{ color: "#f87171", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", padding: "12px", borderRadius: "6px", marginBottom: "20px", fontSize: "13px" }}>{erro}</div>}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "13px" }}>Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px", backgroundColor: "var(--bg-input)", border: "1px solid var(--border-glow)", borderRadius: "8px", color: "#fff", outline: "none", fontSize: "14px" }} placeholder="you@example.com" required />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "13px" }}>Password</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} style={{ width: "100%", padding: "12px", backgroundColor: "var(--bg-input)", border: "1px solid var(--border-glow)", borderRadius: "8px", color: "#fff", outline: "none", fontSize: "14px" }} placeholder="••••••••" required />
          </div>

          <button type="submit" disabled={loading} className="primary-button" style={{ width: "100%", padding: "14px", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "600", fontSize: "14px", cursor: "pointer", marginTop: "12px" }}>
            {loading ? "Authenticating..." : "Enter Workspace"}
          </button>
        </form>
        <p style={{ color: "var(--text-muted)", marginTop: "24px", fontSize: "14px", textAlign: "center" }}>
          Don't have an account? <Link to="/cadastro" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "500" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}