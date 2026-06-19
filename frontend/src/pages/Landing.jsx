import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "60px 20px", maxWidth: "900px", margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "80px" }}>
        <span style={{ fontWeight: "bold", color: "var(--accent-color)" }}>// DEVLAUNCH.ENGINE</span>
        <div style={{ display: "flex", gap: "20px" }}>
          <Link to="/login" style={{ color: "var(--text-main)" }}>[ sign_in ]</Link>
          <Link to="/cadastro" style={{ color: "var(--accent-color)" }}>[ register ]</Link>
        </div>
      </header>

      <main>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>AUTOMATED BOILERPLATE STREAMS.</h1>
        <p style={{ color: "var(--text-muted)", lineHeight: "1.6", fontSize: "16px", marginBottom: "40px" }}>
          A minimal sandbox utility to download structural zip templates without dealing with repository configurations or environment setups. Built for rapid deployment.
        </p>

        <div style={{ display: "flex", gap: "20px", marginBottom: "80px" }}>
          <Link to="/cadastro" className="btn-terminal">Initialize Workspace</Link>
        </div>

        <div style={{ borderTop: "2px solid var(--border-color)", paddingTop: "40px" }}>
          <h3 style={{ marginBottom: "20px" }}>CORE CORE_MODULES</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            <div>
              <h4 style={{ color: "var(--accent-color)" }}>01. React Client</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Clean single page client application shell.</p>
            </div>
            <div>
              <h4 style={{ color: "var(--accent-color)" }}>02. Node.js API</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Express server framework with routing handlers initialized.</p>
            </div>
            <div>
              <h4 style={{ color: "var(--accent-color)" }}>03. Automation Bot</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Discord bot framework using discord.js structures.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}