import express from "express";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { db } from "../services/firestore.js";
import {
  createLawyerProfile,
  listAvailableLawyers,
  getLawyerById
} from "../services/lawyers.js";

const router = express.Router();

// ── Sanitization helpers ──
const stripHtml = (str) => {
  if (typeof str !== "string") return str;
  return str
    .replace(/<[^>]*>/g, "")        // remove HTML tags
    .replace(/[<>"'`]/g, "")      // remove dangerous chars
    .trim()
    .slice(0, 1000);                 // max length
};

const stripShort = (str, max = 200) => {
  if (typeof str !== "string") return str;
  return str.replace(/<[^>]*>/g, "").replace(/[<>"'`]/g, "").trim().slice(0, max);
};

const sanitizeRate = (val) => {
  const n = parseFloat(val);
  if (isNaN(n) || n < 0 || n > 100000) return null;
  return Math.round(n * 100) / 100;
};

router.post("/", authenticate, requireRole("lawyer"), async (req, res) => {
  try {
    const userId = req.user.uid;
    const { name, specialties, hourlyRate, bio } = req.body;

    // Sanitize all inputs
    const cleanName = stripShort(name, 100) || "";
    const cleanBio  = stripHtml(bio) || "";
    const cleanRate = sanitizeRate(hourlyRate);
    const cleanSpecialties = Array.isArray(specialties)
      ? specialties.map(s => stripShort(s, 50)).filter(Boolean).slice(0, 20)
      : typeof specialties === "string"
        ? specialties.split(",").map(s => stripShort(s, 50)).filter(Boolean).slice(0, 20)
        : [];

    if (cleanRate === null) {
      return res.status(400).json({ error: "Invalid hourly rate" });
    }

    // Check if profile already exists
    const existing = await db.collection("lawyers").doc(userId).get();
    const currentStatus = existing.exists ? existing.data().status : null;

    const lawyer = await createLawyerProfile(userId, {
      userId,
      name: cleanName,
      specialties: cleanSpecialties,
      hourlyRate: cleanRate,
      bio: cleanBio,
      // Keep existing status if already approved, otherwise set pending
      status: currentStatus === "approved" ? "approved" : "pending",
      updatedAt: new Date(),
    });

    // Also save name to users collection so it shows on client-facing displays
    if (cleanName) {
      await db.collection("users").doc(userId).update({ name: cleanName }).catch(() => {});
    }

    res.json(lawyer);
  } catch (err) {
    console.error("Create lawyer profile error:", err);
    res.status(500).json({ error: "Failed to create lawyer profile" });
  }
});

router.get("/", async (req, res) => {
  try {
    const lawyers = await listAvailableLawyers();
    res.json(lawyers);
  } catch (err) {
    console.error("List lawyers error:", err);
    res.status(500).json({ error: "Failed to fetch lawyers" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lawyer = await getLawyerById(req.params.id);
    if (!lawyer) return res.status(404).json({ error: "Lawyer not found" });
    res.json(lawyer);
  } catch (err) {
    console.error("Get lawyer error:", err);
    res.status(500).json({ error: "Failed to fetch lawyer" });
  }
});

export default router;
