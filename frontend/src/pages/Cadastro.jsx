import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro(""); setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://devlaunch-backend-uw21.onrender.com/api/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Registration pipeline error.");

      setSucesso("Account registered successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ backgroundColor: "var(--bg-card)", padding: "40px", border: "1px solid var(--border-glow)", width: "100%", maxWidth: "420px", borderRadius: "12px" }}>
        <h2 style={{ color: "#fff", fontSize: "22px", margin: "0 0 8px 0", fontWeight: "600" }}>Create Workspace Account</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 24px 0" }}>Register your developer credentials.</p>

        {erro && <div style={{ color: "#f87171", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", padding: "12px", borderRadius: "6px", marginBottom: "20px", fontSize: "13px" }}>{erro}</div>}
        {sucesso && <div style={{ color: "#34d399", backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981", padding: "12px", borderRadius: "6px", marginBottom: "20px", fontSize: "13px" }}>{sucesso}</div>}

        <form onSubmit={handleCadastro} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "13px" }}>Full Name</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: "100%", padding: "12px", backgroundColor: "var(--bg-input)", border: "1px solid var(--border-glow)", borderRadius: "8px", color: "#fff", outline: "none", fontSize: "14px" }} placeholder="e.g., Alex" required />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "13px" }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px", backgroundColor: "var(--bg-input)", border: "1px solid var(--border-glow)", borderRadius: "8px", color: "#fff", outline: "none", fontSize: "14px" }} placeholder="name@example.com" required />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "13px" }}>Password</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} style={{ width: "100%", padding: "12px", backgroundColor: "var(--bg-input)", border: "1px solid var(--border-glow)", borderRadius: "8px", color: "#fff", outline: "none", fontSize: "14px" }} placeholder="••••••••" required />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "13px" }}>Confirm Password</label>
            <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} style={{ width: "100%", padding: "12px", backgroundColor: "var(--bg-input)", border: "1px solid var(--border-glow)", borderRadius: "8px", color: "#fff", outline: "none", fontSize: "14px" }} placeholder="••••••••" required />
          </div>

          <button type="submit" disabled={loading} className="primary-button" style={{ width: "100%", padding: "14px", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "600", fontSize: "14px", cursor: "pointer", marginTop: "12px" }}>
            {loading ? "Registering profile..." : "Complete Registration"}
          </button>
        </form>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "24px", textAlign: "center" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "500" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}