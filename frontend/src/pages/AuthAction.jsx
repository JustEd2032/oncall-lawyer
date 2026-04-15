import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
  applyActionCode,
  checkActionCode,
} from "firebase/auth";
import { auth } from "../firebase";

export default function AuthAction() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode    = searchParams.get("mode");     // "resetPassword" | "verifyEmail"
  const oobCode = searchParams.get("oobCode");

  const [phase, setPhase]       = useState("loading"); // loading | form | success | error
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!oobCode) { setPhase("error"); return; }

    if (mode === "resetPassword") {
      verifyPasswordResetCode(auth, oobCode)
        .then(email => { setEmail(email); setPhase("form"); })
        .catch(() => setPhase("error"));

    } else if (mode === "verifyEmail") {
      applyActionCode(auth, oobCode)
        .then(() => setPhase("verified"))
        .catch(() => setPhase("error"));

    } else {
      setPhase("error");
    }
  }, [oobCode, mode]);

  const handleReset = async () => {
    setError("");
    if (password.length < 6) return setError("Mínimo 6 caracteres. · Minimum 6 characters.");
    if (password !== confirmPw) return setError("Las contraseñas no coinciden. · Passwords do not match.");
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setPhase("success");
    } catch (err) {
      if (err.code === "auth/expired-action-code") {
        setError("Enlace expirado. Solicite uno nuevo. · Link expired. Please request a new one.");
      } else {
        setError("Ocurrió un error. · An error occurred.");
      }
    } finally { setLoading(false); }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.pattern} />
      <div style={s.card} className="fade-up">

        {/* Header */}
        <div style={s.cardHeader}>
          <img src="/logo-gold.png" alt="Prudente Torres & Asociados A.C." style={s.logo} />
        </div>

        <div style={s.cardBody}>

          {/* Loading */}
          {phase === "loading" && (
            <div style={s.centered}>
              <div style={s.spinner} />
              <p style={s.hint}>Verificando... · Verifying...</p>
            </div>
          )}

          {/* Error */}
          {phase === "error" && (
            <div style={s.centered}>
              <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</p>
              <h2 style={s.title}>Enlace inválido<br /><em style={s.em}>Invalid link</em></h2>
              <p style={s.body}>
                Este enlace es inválido o ha expirado.<br />
                <em>This link is invalid or has expired.</em>
              </p>
              <button className="btn-primary" style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }}
                onClick={() => navigate("/auth")}>
                Regresar · Back to login
              </button>
            </div>
          )}

          {/* ── EMAIL VERIFIED ── */}
          {phase === "verified" && (
            <div style={s.centered}>
              <div style={s.successIcon}>✓</div>
              <h2 style={s.title}>
                ¡Correo verificado!<br />
                <em style={s.em}>Email verified!</em>
              </h2>
              <p style={s.body}>
                Su dirección de correo ha sido verificada exitosamente. Ya puede iniciar sesión.<br />
                <em>Your email address has been successfully verified. You can now sign in.</em>
              </p>
              <button className="btn-primary" style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }}
                onClick={() => navigate("/auth")}>
                Iniciar sesión · Sign in
              </button>
            </div>
          )}

          {/* ── PASSWORD RESET FORM ── */}
          {phase === "form" && (
            <>
              <h2 style={s.title}>
                Nueva contraseña<br />
                <em style={s.em}>Set new password</em>
              </h2>
              <p style={s.body}>
                Restableciendo contraseña para <strong style={{ color: "var(--brown-deep)" }}>{email}</strong>.<br />
                <em>Resetting password for <strong style={{ color: "var(--brown-deep)" }}>{email}</strong>.</em>
              </p>
              <hr className="divider" />
              <div className="form-group">
                <label className="form-label">Nueva contraseña · New password</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Confirmar contraseña · Confirm password</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleReset()} />
              </div>
              <p style={s.hint}>Mínimo 6 caracteres · Minimum 6 characters</p>
              {error && <p className="form-error" style={{ marginBottom: "1rem" }}>{error}</p>}
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.9rem" }}
                onClick={handleReset} disabled={loading}>
                {loading ? "Guardando... · Saving..." : "Restablecer · Reset password"}
              </button>
            </>
          )}

          {/* ── PASSWORD RESET SUCCESS ── */}
          {phase === "success" && (
            <div style={s.centered}>
              <div style={s.successIcon}>✓</div>
              <h2 style={s.title}>
                ¡Contraseña actualizada!<br />
                <em style={s.em}>Password updated!</em>
              </h2>
              <p style={s.body}>
                Su contraseña ha sido restablecida exitosamente.<br />
                <em>Your password has been successfully reset.</em>
              </p>
              <button className="btn-primary" style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }}
                onClick={() => navigate("/auth")}>
                Iniciar sesión · Sign in
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={s.cardFooter}>
          <p style={s.footerText}>Prudente Torres &amp; Asociados A.C. &nbsp;·&nbsp; Abogados &nbsp;·&nbsp; English Spoken</p>
          <p style={s.footerText}>prudentetorres.lat &nbsp;·&nbsp; Tel. (01744) 135-5072</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(155deg, var(--brown-deep) 0%, var(--brown) 60%, var(--brown-mid) 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "2rem", position: "relative", overflow: "hidden",
  },
  pattern: {
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(184,150,46,0.04) 60px, rgba(184,150,46,0.04) 120px)`,
  },
  card: {
    position: "relative", zIndex: 1,
    background: "var(--white)", borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)", border: "1px solid var(--parchment)",
    width: "100%", maxWidth: "440px",
  },
  cardHeader: {
    background: "var(--brown-deep)", borderBottom: "2px solid var(--gold)",
    padding: "1.75rem 2rem", display: "flex", justifyContent: "center",
    borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
  },
  logo: { height: "70px", width: "auto", objectFit: "contain" },
  cardBody: { padding: "2rem" },
  cardFooter: {
    background: "var(--cream)", borderTop: "1px solid var(--parchment)",
    padding: "1rem 2rem", textAlign: "center",
    borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
  },
  footerText: { fontSize: "0.7rem", color: "var(--brown-light)", letterSpacing: "0.05em", margin: "0.15rem 0" },
  title: { fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--brown-deep)", marginBottom: "0.5rem", fontWeight: "400" },
  em: { fontStyle: "italic", color: "var(--brown-light)", fontSize: "1.3rem", fontWeight: "300" },
  body: { fontSize: "0.875rem", color: "var(--gray-warm)", lineHeight: "1.8", marginBottom: "0.5rem" },
  hint: { fontSize: "0.75rem", color: "var(--gray-warm)", marginBottom: "1rem", marginTop: "-0.5rem" },
  centered: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.5rem" },
  spinner: { width: "40px", height: "40px", border: "3px solid var(--parchment)", borderTop: "3px solid var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "0.5rem" },
  successIcon: { width: "60px", height: "60px", background: "var(--parchment)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", color: "var(--gold)", border: "2px solid var(--gold)", marginBottom: "0.5rem", fontFamily: "var(--font-display)" },
};
