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

      if (!response.ok) {
        throw new Error(data.erro || "Invalid credential parameters provided.");
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
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-dark-obsidian)", padding: "20px" }}>
      <div style={{ backgroundColor: "var(--bg-card-charcoal)", padding: "40px", border: "1px solid var(--border-subtle)", width: "100%", maxWidth: "400px", borderRadius: "8px" }}>
        <h2 style={{ color: "#fff", fontSize: "18px", margin: "0 0 6px 0", fontWeight: "700" }}>Authenticate Session Gateway</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: "0 0 24px 0" }}>Establish authorized integrity token connection.</p>
        
        {erro && <div style={{ color: "var(--color-error)", border: "1px solid var(--color-error)", padding: "10px", marginBottom: "20px", fontSize: "12px", fontFamily: "monospace" }}>{erro}</div>}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-secondary)", fontSize: "12px" }}>IDENTITY_ENDPOINT_EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px", backgroundColor: "var(--bg-input-dark)", border: "1px solid var(--border-subtle)", color: "#fff", outline: "none", fontSize: "14px" }} placeholder="user@domain.com" required />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-secondary)", fontSize: "12px" }}>SESSION_INTEGRITY_PASSWORD</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} style={{ width: "100%", padding: "12px", backgroundColor: "var(--bg-input-dark)", border: "1px solid var(--border-subtle)", color: "#fff", outline: "none", fontSize: "14px" }} placeholder="••••••••" required />
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", backgroundColor: "var(--accent-premium)", border: "none", color: "#fff", fontWeight: "600", fontSize: "14px", cursor: "pointer", marginTop: "12px" }}>
            {loading ? "Matching records..." : "Deploy Active Session Token"}
          </button>
        </form>
        <p style={{ color: "var(--text-muted)", marginTop: "24px", fontSize: "13px", textAlign: "center" }}>
          Need credential block? <Link to="/cadastro" style={{ color: "var(--accent-premium)", textDecoration: "none" }}>Register endpoint</Link>
        </p>
      </div>
    </div>
  );
}