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
    setErro("");
    setSucesso("");

    // Validacao local estrita antes do disparo
    if (senha !== confirmarSenha) {
      setErro("Password mismatch. Verification field must be identical.");
      return;
    }

    if (senha.length < 6) {
      setErro("Security threshold failed. Password must be at least 6 characters.");
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

      // Interceptacao de falhas estruturais do banco/servidor
      if (!response.ok) {
        throw new Error(data.erro || "Registration rejected by database engine.");
      }

      setSucesso("REGISTRATION_SUCCESSFUL. Redirecting to auth gate...");
      
      // Limpa os campos
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

      // Delay controlado para o usuario ler o log de sucesso
      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="box-terminal" style={{ width: "100%", maxWidth: "420px" }}>
        <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>// PROVISION_NEW_ACCOUNT</h2>
        
        {erro && (
          <div style={{ color: "var(--error-color)", border: "1px solid var(--error-color)", padding: "10px", marginBottom: "20px", fontSize: "13px" }}>
            STATUS_ERROR: {erro}
          </div>
        )}

        {sucesso && (
          <div style={{ color: "var(--accent-color)", border: "1px solid var(--accent-color)", padding: "10px", marginBottom: "20px", fontSize: "13px", background: "#090a0f" }}>
            {sucesso}
          </div>
        )}

        <form onSubmit={handleCadastro} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px" }}>REGISTRY_NAME</label>
            <input 
              type="text" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              placeholder="e.g. John Doe"
              required 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px" }}>SYSTEM_EMAIL</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="user@domain.com"
              required 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px" }}>ACCESS_PASSWORD</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px" }}>VERIFY_PASSWORD</label>
            <input 
              type="password" 
              value={confirmarSenha} 
              onChange={(e) => setConfirmarSenha(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" disabled={loading} className="btn-terminal" style={{ marginTop: "10px" }}>
            {loading ? "COMMITTING_DATA..." : "EXECUTE_REGISTRATION"}
          </button>
        </form>

        <p style={{ marginTop: "24px", fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
          Existing token? <Link to="/login" style={{ color: "var(--accent-color)" }}>Return to Login</Link>
        </p>
      </div>
    </div>
  );
}