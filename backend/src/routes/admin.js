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

// GET /admin/lawyers — all lawyers with pending/approved status
router.get("/lawyers", authenticate, requireAdmin, async (req, res) => {
  try {
    const snap = await db.collection("lawyers").get();
    const lawyers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(lawyers);
  } catch (err) {
    console.error("Admin get lawyers error:", err);
    res.status(500).json({ error: "Failed to fetch lawyers" });
  }
});

// PATCH /admin/lawyers/:id/status — approve or reject
router.patch("/lawyers/:id/status", authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body; // "approved" | "rejected"
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Status must be approved or rejected" });
    }

    await db.collection("lawyers").doc(req.params.id).update({ status });

    // Get lawyer email to notify them
    const userDoc = await db.collection("users").doc(req.params.id).get();
    const email = userDoc.exists ? userDoc.data().email : null;
    const name = userDoc.exists ? (userDoc.data().name || email) : email;

    // Send notification email
    if (email) {
      const { sendLawyerStatusEmail } = await import("../services/email.js");
      await sendLawyerStatusEmail({ toEmail: email, name, status }).catch(e =>
        console.error("Lawyer status email failed:", e)
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Admin approve lawyer error:", err);
    res.status(500).json({ error: "Failed to update lawyer status" });
  }
});

export default router;
