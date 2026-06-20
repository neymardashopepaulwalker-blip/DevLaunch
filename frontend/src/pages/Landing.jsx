import React from 'react';
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "30px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: "700", fontSize: "16px", color: "#fff" }}>DevLaunch</span>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link to="/login" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "14px" }}>Sign In</Link>
          <Link to="/cadastro" style={{ backgroundColor: "var(--border-subtle)", color: "#fff", padding: "8px 16px", borderRadius: "6px", textDecoration: "none", fontSize: "14px" }}>Register</Link>
        </div>
      </header>

      <main style={{ maxWidth: "800px", width: "100%", margin: "120px auto 0 auto", padding: "0 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: "800", color: "#fff", letterSpacing: "-1.5px", marginBottom: "24px", lineHeight: "1.1" }}>
          Scaffold your next project configuration in seconds.
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "18px", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto 40px auto" }}>
          Generate clean, production-ready boilerplates as streaming standalone archives. Skip the repetitive repository initialization chores.
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "80px" }}>
          <Link to="/cadastro" className="btn-premium" style={{ width: "auto", padding: "14px 32px", textDecoration: "none" }}>
            Get Started Free
          </Link>
        </div>

        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "60px", textAlign: "left" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "30px" }}>
            <div>
              <h4 style={{ color: "#fff", margin: "0 0 10px 0", fontSize: "15px" }}>React Client Setup</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0, lineHeight: "1.5" }}>Vite architecture pre-configured with client routing environments.</p>
            </div>
            <div>
              <h4 style={{ color: "#fff", margin: "0 0 10px 0", fontSize: "15px" }}>Node.js REST Context</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0, lineHeight: "1.5" }}>Express server base structured with native secure CORS handlers mapping.</p>
            </div>
            <div>
              <h4 style={{ color: "#fff", margin: "0 0 10px 0", fontSize: "15px" }}>Automation Engine</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0, lineHeight: "1.5" }}>Discord.js environment frames ready for safe credential ingestion modules.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}