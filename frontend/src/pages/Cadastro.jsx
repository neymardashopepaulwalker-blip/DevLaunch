import React, { useState } from "react";
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
    setErro("");
    setSucesso("");

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

      if (!response.ok) {
        throw new Error(data.erro || "Could not complete registration.");
      }

      setSucesso("Account created successfully. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ backgroundColor: "var(--bg-card)", padding: "40px", borderRadius: "12px", border: "1px solid var(--border-subtle)", width: "100%", maxWidth: "400px" }}>
        <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: "0 0 8px 0" }}>Create an account</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 24px 0" }}>Get started with your developer workspace environment.</p>

        {erro && <div style={{ color: "var(--error)", fontSize: "13px", marginBottom: "16px" }}>{erro}</div>}
        {sucesso && <div style={{ color: "var(--success)", fontSize: "13px", marginBottom: "16px" }}>{sucesso}</div>}

        <form onSubmit={handleCadastro} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-muted)", fontSize: "12px" }}>Full Name</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="input-premium" required />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-muted)", fontSize: "12px" }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-premium" required />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-muted)", fontSize: "12px" }}>Password</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="input-premium" required />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-muted)", fontSize: "12px" }}>Confirm Password</label>
            <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="input-premium" required />
          </div>

          <button type="submit" disabled={loading} className="btn-premium" style={{ marginTop: "8px" }}>
            {loading ? "Creating account..." : "Register Workspace"}
          </button>
        </form>

        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "24px", textAlign: "center", margin: "24px 0 0 0" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent-purple)", textDecoration: "none" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}