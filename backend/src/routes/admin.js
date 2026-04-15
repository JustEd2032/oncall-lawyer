import express from "express";
import { authenticate } from "../middleware/auth.js";
import { db } from "../services/firestore.js";
import admin from "firebase-admin";

const router = express.Router();

// List of admin UIDs — must match frontend AdminPanel.jsx
const ADMIN_UIDS = [
  "rJANRIFrYrOhcFskHLPAkTcgX1A3"
];

// Middleware — only admin UIDs can access these routes
const requireAdmin = (req, res, next) => {
  if (!ADMIN_UIDS.includes(req.user.uid)) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// GET /admin/users — all users
router.get("/users", authenticate, requireAdmin, async (req, res) => {
  try {
    const snap = await db.collection("users").get();
    const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(users);
  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /admin/appointments — all appointments
router.get("/appointments", authenticate, requireAdmin, async (req, res) => {
  try {
    const snap = await db.collection("appointments").orderBy("scheduledAt", "desc").get();
    const appointments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(appointments);
  } catch (err) {
    console.error("Admin get appointments error:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// PATCH /admin/appointments/:id — update status
router.patch("/appointments/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const VALID = ["pending", "confirmed", "completed", "cancelled"];
    if (!VALID.includes(status)) return res.status(400).json({ error: "Invalid status" });
    await db.collection("appointments").doc(req.params.id).update({ status });
    res.json({ success: true });
  } catch (err) {
    console.error("Admin update appointment error:", err);
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

// DELETE /admin/users/:id — delete user from Firestore
router.delete("/users/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const uid = req.params.id;
    await db.collection("users").doc(uid).delete();
    await db.collection("lawyers").doc(uid).delete().catch(() => {});
    await db.collection("availability").doc(uid).delete().catch(() => {});
    // Also delete from Firebase Auth
    await admin.auth().deleteUser(uid).catch(e => console.warn("Auth delete warning:", e.message));
    res.json({ success: true });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
