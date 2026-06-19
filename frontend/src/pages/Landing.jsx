import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div style={styles.container}>
      {/* 🧭 NAVIGATION BAR */}
      <header style={styles.header}>
        <div style={styles.logo}>
          DevLaunch <span style={styles.logoIcon}>🚀</span>
        </div>
        <nav style={styles.navLinks}>
          <Link to="/login" style={styles.loginLink}>Sign In</Link>
          <Link to="/cadastro" style={styles.signUpBtnTop}>Get Started</Link>
        </nav>
      </header>

      {/* 🚀 HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.badge}>PRODUCTION READY TEMPLATES</div>
        <h1 style={styles.mainTitle}>
          Generate Production-Ready <br />
          <span style={styles.gradientText}>Code Templates In Seconds</span>
        </h1>
        <p style={styles.subtitle}>
          Stop wasting time setting up boilerplates. Choose your stack, download a clean 
          structured .ZIP archive, and start coding your next big idea immediately.
        </p>
        <div style={styles.ctaGroup}>
          <Link to="/cadastro" style={styles.mainCta}>Create Free Account</Link>
          <a href="#features" style={styles.secondaryCta}>Learn More ↓</a>
        </div>
      </section>

      {/* 🛠️ FEATURES SECTION */}
      <section id="features" style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Supported Stacks & Tech</h2>
        <p style={styles.sectionSubtitle}>Clean, structured, and deployment-ready architecture.</p>
        
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardIcon}>⚛️</div>
            <h3 style={styles.cardTitle}>React Boilerplate</h3>
            <p style={styles.cardDesc}>
              A modern Single Page Application architecture with component structures and clean routing setup.
            </p>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>🌐</div>
            <h3 style={styles.cardTitle}>Node.js REST API</h3>
            <p style={styles.cardDesc}>
              Structured Express server environment with pre-configured CORS, JSON middleware, and clean route management.
            </p>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>🤖</div>
            <h3 style={styles.cardTitle}>Discord Bot Base</h3>
            <p style={styles.cardDesc}>
              A solid automation structure ready to boot up utilizing robust configurations and environmental files.
            </p>
          </div>
        </div>
      </section>

      {/* 🔒 FOOTER */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>&copy; 2026 DevLaunch Sandbox. Built for developers worldwide.</p>
      </footer>
    </div>
  );
}

// 🎨 PREMIUM ULTRA DARK THEME STYLES (MATCHING YOUR DASHBOARD)
const styles = {
  container: {
    backgroundColor: "#090d16",
    color: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "25px 5%, 25px 5%",
    maxWidth: "1200px",
    width: "90%",
    margin: "0 auto",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "900",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoIcon: {
    fontSize: "20px",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },
  loginLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    transition: "color 0.2s",
    cursor: "pointer",
  },
  signUpBtnTop: {
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    border: "1px solid #334155",
    transition: "background 0.2s",
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "100px 20px 80px 20px",
    maxWidth: "850px",
    margin: "0 auto",
  },
  badge: {
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    color: "#38bdf8",
    border: "1px solid rgba(56, 189, 248, 0.2)",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "24px",
  },
  mainTitle: {
    fontSize: "52px",
    fontWeight: "800",
    lineHeight: "1.15",
    color: "#fff",
    margin: "0 0 20px 0",
    letterSpacing: "-1px",
  },
  gradientText: {
    background: "linear-gradient(to right, #38bdf8, #818cf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "18px",
    color: "#94a3b8",
    lineHeight: "1.6",
    marginBottom: "40px",
    maxWidth: "650px",
  },
  ctaGroup: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  mainCta: {
    backgroundColor: "#38bdf8",
    color: "#090d16",
    padding: "14px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "16px",
    boxShadow: "0 4px 14px rgba(56, 189, 248, 0.3)",
    transition: "transform 0.2s",
  },
  secondaryCta: {
    color: "#94a3b8",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    padding: "14px 20px",
  },
  featuresSection: {
    maxWidth: "1100px",
    width: "90%",
    margin: "0 auto",
    padding: "80px 0",
    borderTop: "1px solid #1e293b",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "10px",
  },
  sectionSubtitle: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "50px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },
  card: {
    backgroundColor: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "12px",
    padding: "40px 30px",
    textAlign: "left",
    transition: "transform 0.2s, border-color 0.2s",
  },
  cardIcon: {
    fontSize: "36px",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "12px",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#94a3b8",
    lineHeight: "1.6",
    margin: 0,
  },
  footer: {
    marginTop: "auto",
    borderTop: "1px solid #1e293b",
    padding: "30px 20px",
    textAlign: "center",
    backgroundColor: "#060911",
  },
  footerText: {
    fontSize: "14px",
    color: "#475569",
    margin: 0,
  },
};