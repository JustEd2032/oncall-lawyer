import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  // Still loading
  if (user === undefined) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", fontFamily: "var(--font-body)", color: "var(--brown-light)",
        background: "var(--ivory)", fontSize: "0.9rem", letterSpacing: "0.1em",
      }}>
        Cargando...
      </div>
    );
  }

  // Not logged in
  if (!user) return <Navigate to="/auth" />;

  // Logged in but email not verified — sign out and redirect
  if (!user.emailVerified) {
    signOut(auth); // clear the stuck session
    return <Navigate to="/auth?unverified=1" />;
  }

  return children;
}

export default ProtectedRoute;
