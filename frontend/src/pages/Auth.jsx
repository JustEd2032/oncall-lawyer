import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase";
import api from "../api";

export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "register" | "verify"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("client");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {
        await sendEmailVerification(cred.user);
        setError("Verifique su correo antes de iniciar sesión. Le reenviamos el enlace de verificación. · Please verify your email first. We resent the verification link.");
        setLoading(false);
        return;
      }
      const token = await cred.user.getIdToken();
      await api.post("/users", {}, { headers: { Authorization: `Bearer ${token}` } });
      await cred.user.getIdToken(true);
    } catch (err) { setError(friendlyError(err.code)); }
    finally { setLoading(false); }
  };

  const handleRegister = async () => {
    setError("");
    if (password !== confirmPassword) return setError("Las contraseñas no coinciden. · Passwords do not match.");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres. · Password must be at least 6 characters.");
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      const token = await cred.user.getIdToken();
      await api.post("/users", { role: selectedRole }, { headers: { Authorization: `Bearer ${token}` } });
      setMode("verify");
    } catch (err) { setError(friendlyError(err.code)); }
    finally { setLoading(false); }
  };

  const handleForgot = async () => {
    if (!forgotEmail) return setForgotStatus("error:Ingrese su correo electrónico. · Please enter your email.");
    setForgotLoading(true); setForgotStatus("");
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotStatus("success");
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-email") {
        setForgotStatus("error:Correo no encontrado. · Email not found.");
      } else {
        setForgotStatus("error:Ocurrió un error. Intente nuevamente. · An error occurred. Please try again.");
      }
    } finally { setForgotLoading(false); }
  };

  const friendlyError = (code) => {
    switch (code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential": return "Correo o contraseña incorrectos. · Invalid email or password.";
      case "auth/email-already-in-use": return "Ya existe una cuenta con este correo. · An account with this email already exists.";
      case "auth/invalid-email": return "Por favor ingrese un correo válido. · Please enter a valid email.";
      case "auth/too-many-requests": return "Demasiados intentos. Intente más tarde. · Too many attempts. Try again later.";
      default: return "Ocurrió un error. Intente nuevamente. · An error occurred. Please try again.";
    }
  };

  return (
    <div style={s.wrapper} className="auth-wrapper">
      {/* Left panel */}
      <div style={s.left} className="auth-left">
        <div style={s.leftPattern} />
        <div style={s.leftContent}>
          <div style={s.leftSplit}>
            <div style={s.leftLogoCol}>
              <img src="/logo-gold.png" alt="Prudente Torres & Asociados A.C." style={s.leftLogo} />
            </div>
            <div style={s.leftTextCol}>
              <div style={s.leftRule} />
              <h2 style={s.leftTitle} className="auth-left-title">
                Portal de Clientes<br />
                <em style={{ fontStyle: "italic", color: "var(--gold-light)", fontWeight: "300" }}>Client Portal</em>
              </h2>
              <p style={s.leftText}>
                Acceda para agendar consultas, gestionar sus citas y comunicarse con nuestro equipo.
                Access to schedule consultations and manage your appointments.
              </p>
              <div style={s.practiceList} className="auth-practice-list">
                {["Penal · Criminal", "Civil", "Familiar · Family", "Laboral · Labor", "Fiscal · Tax"].map(p => (
                  <div key={p} style={s.practiceItem}>
                    <span style={s.practiceDot}>◆</span>
                    <span>Derecho {p}</span>
                  </div>
                ))}
              </div>
              <button style={s.backBtn} onClick={() => navigate("/")}>
                ← Regresar al inicio · Back to home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={s.right} className="auth-right">
        <div style={s.formCard} className="fade-up">
          <div style={s.formHeader}>
            <img src="/logo-transparent.png" alt="Prudente Torres" style={s.formLogo} />
          </div>

          {/* Tabs — hidden on verify screen */}
          {mode !== "verify" && (
            <div style={s.tabs}>
              <button style={{ ...s.tab, ...(mode === "login" ? s.tabActive : {}) }}
                onClick={() => { setMode("login"); setError(""); }}>
                Iniciar Sesión
              </button>
              <button style={{ ...s.tab, ...(mode === "register" ? s.tabActive : {}) }}
                onClick={() => { setMode("register"); setError(""); }}>
                Registrarse
              </button>
            </div>
          )}

          <div style={{ padding: "2rem" }}>

            {/* ── VERIFY SCREEN ── */}
            {mode === "verify" && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✉️</div>
                <h2 style={s.formTitle}>
                  Verifique su correo
                </h2>
                <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--brown-light)", fontSize: "1.1rem", marginBottom: "1rem" }}>
                  Verify your email
                </p>
                <hr className="divider" />
                <p style={{ color: "var(--gray-warm)", fontSize: "0.875rem", lineHeight: "1.8", marginBottom: "1rem" }}>
                  Enviamos un enlace de verificación a:<br />
                  <strong style={{ color: "var(--brown-deep)" }}>{email}</strong>
                </p>
                <p style={{ color: "var(--gray-warm)", fontSize: "0.875rem", lineHeight: "1.8", marginBottom: "1.5rem" }}>
                  Haga clic en el enlace para activar su cuenta y luego inicie sesión.<br />
                  <em>Click the link to activate your account then sign in.</em>
                </p>
                <p style={{ color: "var(--gray-warm)", fontSize: "0.78rem", marginBottom: "1.5rem" }}>
                  ¿No recibió el correo? Revise la carpeta de spam.<br />
                  <em>Didn't receive it? Check your spam folder.</em>
                </p>
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => { setMode("login"); setError(""); }}>
                  Ir a iniciar sesión · Go to login
                </button>
              </div>
            )}

            {/* ── LOGIN / REGISTER FORM ── */}
            {mode !== "verify" && (
              <>
                <h2 style={s.formTitle}>
                  {mode === "login" ? "Bienvenido" : "Crear cuenta"}
                </h2>
                <p style={s.formSubtitle}>
                  {mode === "login"
                    ? "Acceda a su portal · Access your portal"
                    : "Registro de nuevo cliente · New client registration"}
                </p>
                <hr className="divider" />

                <div className="form-group">
                  <label className="form-label">Correo electrónico · Email</label>
                  <input className="form-input" type="email" placeholder="correo@ejemplo.com"
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Contraseña · Password</label>
                  <input className="form-input" type="password" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                {mode === "register" && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Confirmar contraseña · Confirm password</label>
                      <input className="form-input" type="password" placeholder="••••••••"
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>

                    {/* Role selector */}
                    <div className="form-group">
                      <label className="form-label">Tipo de cuenta · Account type</label>
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        {[
                          { value: "client", labelEs: "Cliente", labelEn: "Client", icon: "👤" },
                          { value: "lawyer", labelEs: "Abogado/a", labelEn: "Lawyer", icon: "⚖️" },
                        ].map(({ value, labelEs, labelEn, icon }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSelectedRole(value)}
                            style={{
                              flex: 1, padding: "0.75rem",
                              border: `2px solid ${selectedRole === value ? "var(--gold)" : "var(--parchment)"}`,
                              borderRadius: "var(--radius)",
                              background: selectedRole === value ? "var(--parchment)" : "var(--white)",
                              color: selectedRole === value ? "var(--brown-deep)" : "var(--gray-warm)",
                              fontFamily: "var(--font-body)", cursor: "pointer",
                              fontSize: "0.85rem", fontWeight: selectedRole === value ? "600" : "400",
                              display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem",
                              transition: "all 0.15s",
                            }}
                          >
                            <span style={{ fontSize: "1.3rem" }}>{icon}</span>
                            <span>{labelEs}</span>
                            <span style={{ fontSize: "0.7rem", color: "var(--brown-light)" }}>{labelEn}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {error && <p className="form-error" style={{ marginBottom: "1rem" }}>{error}</p>}

                <button className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "0.9rem" }}
                  onClick={mode === "login" ? handleLogin : handleRegister}
                  disabled={loading}>
                  {loading ? "Por favor espere..." : mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                </button>

                {/* Privacy policy link */}
                <p style={{ textAlign: "center", marginTop: "0.75rem", fontSize: "0.72rem", color: "var(--gray-warm)" }}>
                  <a href="/privacidad" style={{ color: "var(--brown-light)", textDecoration: "underline" }}>
                    Aviso de Privacidad · Privacy Policy
                  </a>
                </p>

                {/* Forgot password */}
                {mode === "login" && (
                  <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
                    <button
                      onClick={() => { setShowForgot(true); setForgotEmail(email); setForgotStatus(""); }}
                      style={{ background: "none", border: "none", color: "var(--brown-light)", fontSize: "0.8rem", cursor: "pointer", fontFamily: "var(--font-body)", textDecoration: "underline" }}
                    >
                      ¿Olvidó su contraseña? · Forgot password?
                    </button>
                  </p>
                )}
              </>
            )}

            {/* ── Forgot password modal ── */}
            {showForgot && (
              <div style={{
                position: "fixed", inset: 0, background: "rgba(44,26,14,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 999, padding: "1rem",
              }} onClick={() => setShowForgot(false)}>
                <div style={{
                  background: "var(--white)", borderRadius: "var(--radius-lg)",
                  padding: "2rem", maxWidth: "420px", width: "100%",
                  boxShadow: "var(--shadow-lg)", border: "1px solid var(--parchment)",
                }} onClick={e => e.stopPropagation()}>
                  {forgotStatus === "success" ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✉️</div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--brown-deep)", marginBottom: "0.75rem" }}>
                        Correo enviado · Email sent
                      </h3>
                      <p style={{ color: "var(--gray-warm)", fontSize: "0.875rem", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                        Hemos enviado un enlace para restablecer su contraseña a <strong>{forgotEmail}</strong>.<br />
                        <em>We sent a password reset link to <strong>{forgotEmail}</strong>.</em>
                      </p>
                      <p style={{ color: "var(--gray-warm)", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
                        Revise su bandeja de entrada y carpeta de spam.<br />
                        <em>Check your inbox and spam folder.</em>
                      </p>
                      <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}
                        onClick={() => setShowForgot(false)}>
                        Cerrar · Close
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--brown-deep)" }}>
                          Restablecer contraseña<br />
                          <em style={{ fontStyle: "italic", color: "var(--brown-light)", fontSize: "1rem", fontWeight: "300" }}>Reset password</em>
                        </h3>
                        <button onClick={() => setShowForgot(false)} style={{ background: "none", border: "none", fontSize: "1.1rem", color: "var(--gray-warm)", cursor: "pointer" }}>✕</button>
                      </div>
                      <hr className="divider" />
                      <p style={{ color: "var(--gray-warm)", fontSize: "0.85rem", lineHeight: "1.7", marginBottom: "1.25rem" }}>
                        Ingrese su correo y le enviaremos un enlace para restablecer su contraseña.<br />
                        <em>Enter your email and we'll send you a link to reset your password.</em>
                      </p>
                      <div className="form-group">
                        <label className="form-label">Correo electrónico · Email</label>
                        <input className="form-input" type="email" placeholder="correo@ejemplo.com"
                          value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleForgot()} autoFocus />
                      </div>
                      {forgotStatus.startsWith("error:") && (
                        <p className="form-error" style={{ marginBottom: "1rem" }}>
                          {forgotStatus.replace("error:", "")}
                        </p>
                      )}
                      <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.85rem" }}
                        onClick={handleForgot} disabled={forgotLoading}>
                        {forgotLoading ? "Enviando... · Sending..." : "Enviar enlace · Send reset link"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrapper: { display: "flex", minHeight: "100vh" },
  left: {
    flex: 1, position: "relative",
    background: "linear-gradient(155deg, var(--brown-deep) 0%, var(--brown) 60%, var(--brown-mid) 100%)",
    display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "0",
    overflow: "hidden",
  },
  leftPattern: {
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(184,150,46,0.04) 60px, rgba(184,150,46,0.04) 120px)`,
  },
  leftContent: { position: "relative", zIndex: 1, width: "100%", height: "100%", display: "flex", alignItems: "stretch" },
  leftSplit: { display: "flex", alignItems: "center", width: "100%", height: "100%" },
  leftLogoCol: {
    width: "45%", display: "flex", alignItems: "center", justifyContent: "center",
    padding: "3rem 1.5rem 3rem 3rem", borderRight: "1px solid rgba(184,150,46,0.2)",
    alignSelf: "stretch",
  },
  leftTextCol: {
    flex: 1, padding: "3rem 2.5rem 3rem 2rem",
    display: "flex", flexDirection: "column", justifyContent: "center",
  },
  leftLogo: { width: "100%", maxWidth: "220px", height: "auto", objectFit: "contain", display: "block" },
  leftRule: { height: "1px", background: "linear-gradient(to right, var(--gold), transparent)", marginBottom: "1.5rem" },
  leftTitle: { fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: "300", color: "var(--cream)", lineHeight: "1.2", marginBottom: "1rem" },
  leftText: { fontSize: "0.875rem", color: "rgba(245,240,232,0.62)", lineHeight: "1.85", marginBottom: "2rem", fontWeight: "300" },
  practiceList: { display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2.5rem" },
  practiceItem: { display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.83rem", color: "rgba(245,240,232,0.78)" },
  practiceDot: { color: "var(--gold)", fontSize: "0.45rem", flexShrink: 0 },
  backBtn: { background: "none", border: "none", color: "var(--gray-warm)", fontSize: "0.75rem", letterSpacing: "0.06em", cursor: "pointer", fontFamily: "var(--font-body)" },
  right: { width: "500px", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "var(--cream)" },
  formCard: { background: "var(--white)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", border: "1px solid var(--parchment)", width: "100%", overflow: "hidden" },
  formHeader: { background: "var(--cream)", padding: "1.5rem 2rem", borderBottom: "1px solid var(--parchment)", display: "flex", justifyContent: "center" },
  formLogo: { height: "50px", width: "auto", objectFit: "contain" },
  tabs: { display: "flex", borderBottom: "1px solid var(--parchment)" },
  tab: { flex: 1, padding: "0.85rem", border: "none", background: "none", fontSize: "0.78rem", fontWeight: "500", color: "var(--gray-warm)", letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "2px solid transparent", transition: "all 0.2s", fontFamily: "var(--font-body)", cursor: "pointer" },
  tabActive: { color: "var(--brown-deep)", borderBottom: "2px solid var(--gold)", fontWeight: "600" },
  formTitle: { fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--brown-deep)", marginBottom: "0.25rem", fontWeight: "400" },
  formSubtitle: { color: "var(--gray-warm)", fontSize: "0.78rem" },
};
