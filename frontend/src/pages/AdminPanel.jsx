import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import api from "../api";

const ADMIN_UIDS = [
  "rJANRIFrYrOhcFskHLPAkTcgX1A3"
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ users: 0, lawyers: 0, clients: 0, appointments: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 });
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) { navigate("/auth"); return; }
      setUser(firebaseUser);
      if (ADMIN_UIDS.includes(firebaseUser.uid)) {
        setAuthorized(true);
        await loadAll(firebaseUser);
      } else {
        setAuthorized(false);
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const loadAll = async (firebaseUser) => {
    setLoading(true);
    try {
      const token = await firebaseUser.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, apptsRes] = await Promise.all([
        api.get("/admin/users", { headers }),
        api.get("/admin/appointments", { headers }),
      ]);

      const usersData = usersRes.data || [];
      const apptsData = apptsRes.data || [];

      setUsers(usersData);
      setAppointments(apptsData);
      setStats({
        users: usersData.length,
        lawyers: usersData.filter(u => u.role === "lawyer").length,
        clients: usersData.filter(u => u.role === "client").length,
        appointments: apptsData.length,
        pending: apptsData.filter(a => a.status === "pending").length,
        confirmed: apptsData.filter(a => a.status === "confirmed").length,
        completed: apptsData.filter(a => a.status === "completed").length,
        cancelled: apptsData.filter(a => a.status === "cancelled").length,
      });
    } catch (err) {
      console.error("Admin load error:", err);
      alert("Failed to load admin data: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Delete user ${email}? This removes them from Firestore AND Firebase Auth.`)) return;
    try {
      const token = await user.getIdToken();
      await api.delete(`/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(prev => prev.filter(u => u.id !== userId));
      setStats(prev => ({ ...prev, users: prev.users - 1 }));
    } catch (err) {
      alert("Failed to delete: " + (err.response?.data?.error || err.message));
    }
  };

  const handleAppointmentStatus = async (apptId, status) => {
    try {
      const token = await user.getIdToken();
      await api.patch(`/admin/appointments/${apptId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status } : a));
    } catch (err) {
      alert("Failed to update: " + (err.response?.data?.error || err.message));
    }
  };

  const formatTs = (ts) => {
    if (!ts) return "—";
    try {
      const d = ts?.toDate ? ts.toDate() : ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
      return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return "—"; }
  };

  const filteredUsers = users.filter(u =>
    !search || u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase()) ||
    u.id?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAppts = appointments.filter(a =>
    !search || a.clientId?.includes(search) ||
    a.lawyerId?.includes(search) ||
    a.status?.includes(search)
  );

  if (authorized === null || loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--ivory)", flexDirection: "column", gap: "1rem" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid var(--parchment)", borderTop: "3px solid var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "var(--brown-light)", fontFamily: "var(--font-body)", letterSpacing: "0.1em" }}>Cargando panel...</p>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--ivory)", flexDirection: "column", gap: "1rem" }}>
        <p style={{ fontSize: "3rem" }}>🔒</p>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--brown-deep)" }}>Acceso denegado · Access Denied</h2>
        <button className="btn-primary" onClick={() => navigate("/")}>Regresar · Back</button>
      </div>
    );
  }

  return (
    <div style={s.wrapper}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <div>
            <div style={s.brandMain}>PRUDENTE TORRES — PANEL ADMIN</div>
            <div style={s.brandSub}>{user?.email}</div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="btn-secondary" style={{ fontSize: "0.8rem" }} onClick={() => loadAll(user)}>↻ Refresh</button>
            <button className="btn-secondary" style={{ fontSize: "0.8rem" }} onClick={() => navigate("/lawyer-dashboard")}>← Exit</button>
          </div>
        </div>
      </header>

      <div style={s.content}>
        <input className="form-input" placeholder="Buscar · Search by email, UID, role, status..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: "500px", marginBottom: "1.5rem" }} />

        <div style={s.tabs}>
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "users", label: `👥 Users (${stats.users})` },
            { id: "appointments", label: `📋 Appointments (${stats.appointments})` },
          ].map(tab => (
            <button key={tab.id} style={{ ...s.tab, ...(activeTab === tab.id ? s.tabActive : {}) }}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div style={s.statsGrid}>
              {[
                { label: "Total Users", value: stats.users, icon: "👥" },
                { label: "Lawyers", value: stats.lawyers, icon: "⚖️" },
                { label: "Clients", value: stats.clients, icon: "👤" },
                { label: "Total Appts", value: stats.appointments, icon: "📋" },
                { label: "Pending", value: stats.pending, icon: "⏳" },
                { label: "Confirmed", value: stats.confirmed, icon: "✅" },
                { label: "Completed", value: stats.completed, icon: "🏁" },
                { label: "Cancelled", value: stats.cancelled, icon: "❌" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="card" style={s.statCard}>
                  <span style={{ fontSize: "1.5rem" }}>{icon}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: "700", color: "var(--brown-deep)" }}>{value}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--gray-warm)" }}>{label}</span>
                </div>
              ))}
            </div>
            <h3 style={s.sectionTitle}>Recent Appointments</h3>
            <div className="card" style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead><tr style={s.thead}>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Client</th>
                  <th style={s.th}>Lawyer</th>
                  <th style={s.th}>Status</th>
                </tr></thead>
                <tbody>
                  {appointments.slice(0, 10).map(a => (
                    <tr key={a.id} style={s.tr}>
                      <td style={s.td}>{formatTs(a.scheduledAt)}</td>
                      <td style={s.td}><code style={s.code}>{a.clientId?.slice(0, 12)}...</code></td>
                      <td style={s.td}><code style={s.code}>{a.lawyerId?.slice(0, 12)}...</code></td>
                      <td style={s.td}><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <h3 style={s.sectionTitle}>All Users ({filteredUsers.length})</h3>
            <div className="card" style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead><tr style={s.thead}>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Role</th>
                  <th style={s.th}>UID</th>
                  <th style={s.th}>Created</th>
                  <th style={s.th}>Actions</th>
                </tr></thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} style={s.tr}>
                      <td style={s.td}>{u.email}</td>
                      <td style={s.td}>
                        <span style={{ ...s.roleBadge, background: u.role === "lawyer" ? "var(--parchment)" : "var(--cream)", color: u.role === "lawyer" ? "var(--gold)" : "var(--brown-mid)" }}>
                          {u.role === "lawyer" ? "⚖️ Lawyer" : "👤 Client"}
                        </span>
                      </td>
                      <td style={s.td}><code style={s.code}>{u.id?.slice(0, 14)}...</code></td>
                      <td style={s.td}>{u.createdAt?._seconds ? new Date(u.createdAt._seconds * 1000).toLocaleDateString("es-MX") : "—"}</td>
                      <td style={s.td}>
                        {u.id !== user?.uid && (
                          <button onClick={() => handleDeleteUser(u.id, u.email)}
                            style={{ background: "none", border: "1px solid var(--error)", color: "var(--error)", borderRadius: "6px", padding: "0.25rem 0.6rem", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* APPOINTMENTS */}
        {activeTab === "appointments" && (
          <>
            <h3 style={s.sectionTitle}>All Appointments ({filteredAppts.length})</h3>
            <div className="card" style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead><tr style={s.thead}>
                  <th style={s.th}>Date & Time</th>
                  <th style={s.th}>Client</th>
                  <th style={s.th}>Lawyer</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Change</th>
                </tr></thead>
                <tbody>
                  {filteredAppts.map(a => (
                    <tr key={a.id} style={s.tr}>
                      <td style={s.td}>{formatTs(a.scheduledAt)}</td>
                      <td style={s.td}><code style={s.code}>{a.clientId?.slice(0, 10)}...</code></td>
                      <td style={s.td}><code style={s.code}>{a.lawyerId?.slice(0, 10)}...</code></td>
                      <td style={s.td}><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                      <td style={s.td}>
                        <select value={a.status} onChange={e => handleAppointmentStatus(a.id, e.target.value)}
                          style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", border: "1px solid var(--parchment)", borderRadius: "6px", fontFamily: "var(--font-body)", background: "var(--white)", color: "var(--brown-deep)", cursor: "pointer" }}>
                          {["pending", "confirmed", "completed", "cancelled"].map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  wrapper: { minHeight: "100vh", background: "var(--ivory)" },
  header: { background: "var(--brown-deep)", borderBottom: "3px solid var(--gold)", padding: "0 2.5rem", position: "sticky", top: 0, zIndex: 100 },
  headerInner: { maxWidth: "1200px", margin: "0 auto", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  brandMain: { fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: "700", color: "var(--gold)", letterSpacing: "0.08em" },
  brandSub: { fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "rgba(245,240,232,0.5)", letterSpacing: "0.1em" },
  content: { maxWidth: "1200px", margin: "0 auto", padding: "2rem" },
  tabs: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" },
  tab: { padding: "0.6rem 1.25rem", border: "1.5px solid var(--parchment)", borderRadius: "var(--radius)", background: "var(--white)", color: "var(--brown-mid)", fontWeight: "500", fontSize: "0.875rem", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s" },
  tabActive: { background: "var(--brown-deep)", color: "var(--gold)", borderColor: "var(--brown-deep)" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" },
  statCard: { padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.35rem" },
  sectionTitle: { fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--brown-deep)", marginBottom: "0.75rem" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "600px" },
  thead: { background: "var(--parchment)" },
  th: { padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "var(--brown-mid)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-body)" },
  tr: { borderBottom: "1px solid var(--parchment)" },
  td: { padding: "0.75rem 1rem", fontSize: "0.85rem", color: "var(--brown-deep)", fontFamily: "var(--font-body)" },
  code: { background: "var(--parchment)", padding: "0.1rem 0.4rem", borderRadius: "4px", fontSize: "0.75rem", fontFamily: "monospace" },
  roleBadge: { padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "600" },
};
