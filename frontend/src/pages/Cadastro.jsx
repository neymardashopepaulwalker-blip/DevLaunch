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
      setErro("Verification threshold mismatch. Verify password parameters.");
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
      if (!response.ok) throw new Error(data.erro || "Registration rejected.");

      setSucesso("Registry successfully committed. Routing to auth gateway...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-dark-obsidian)", padding: "20px" }}>
      <div style={{ backgroundColor: "var(--bg-card-charcoal)", padding: "40px", border: "1px solid var(--border-subtle)", width: "100%", maxWidth: "420px", borderRadius: "8px" }}>
        <h2 style={{ color: "#fff", fontSize: "20px", margin: "0 0 6px 0", fontWeight: "700" }}>Provision Account Node</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "0 0 24px 0" }}>Deploy your credentials to the centralized user table registry.</p>

        {erro && <div style={{ color: "var(--color-error)", border: "1px solid var(--color-error)", padding: "10px", marginBottom: "20px", fontSize: "13px", fontFamily: "monospace" }}>ERROR: {erro}</div>}
        {sucesso && <div style={{ color: "var(--color-success)", border: "1px solid var(--color-success)", padding: "10px", marginBottom: "20px", fontSize: "13px", fontFamily: "monospace" }}>{sucesso}</div>}

        <form onSubmit={handleCadastro} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: "600" }}>SYSTEM_IDENTITY_NAME</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: "100%", padding: "12px", backgroundColor: "var(--bg-input-dark)", border: "1px solid var(--border-subtle)", color: "#fff", outline: "none", fontSize: "14px" }} placeholder="e.g. Ítalo J." required />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: "600" }}>REGISTRY_EMAIL_ENDPOINT</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px", backgroundColor: "var(--bg-input-dark)", border: "1px solid var(--border-subtle)", color: "#fff", outline: "none", fontSize: "14px" }} placeholder="user@domain.com" required />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: "600" }}>INTEGRITY_PASSWORD</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} style={{ width: "100%", padding: "12px", backgroundColor: "var(--bg-input-dark)", border: "1px solid var(--border-subtle)", color: "#fff", outline: "none", fontSize: "14px" }} placeholder="••••••••" required />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: "600" }}>CONFIRM_INTEGRITY_PASSWORD</label>
            <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} style={{ width: "100%", padding: "12px", backgroundColor: "var(--bg-input-dark)", border: "1px solid var(--border-subtle)", color: "#fff", outline: "none", fontSize: "14px" }} placeholder="••••••••" required />
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", backgroundColor: "var(--accent-premium)", border: "none", color: "#fff", fontWeight: "600", fontSize: "14px", cursor: "pointer", marginTop: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {loading ? "Committing records..." : "Deploy Active Session Token"}
          </button>
        </form>
        <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "24px", textAlign: "center", margin: "24px 0 0 0" }}>
          Already mapped? <Link to="/login" style={{ color: "var(--accent-premium)", textDecoration: "none", fontWeight: "600" }}>Sign In Gate</Link>
        </p>
      </div>
    </div>
  );
}