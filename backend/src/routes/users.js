import express from "express";
import { createUser, getUser } from "../services/users.js";
import { authenticate } from "../middleware/auth.js";
import admin from "firebase-admin";

const router = express.Router();

const VALID_ROLES = ["client", "lawyer"];

// ── Sanitization ──
const cleanEmail = (str) => {
  if (typeof str !== "string") return "";
  return str.toLowerCase().trim().slice(0, 254);
};

const cleanStr = (str, max = 100) => {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").replace(/[<>'"` ]/g, " ").trim().slice(0, max);
};

router.post("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.uid;
    const email  = req.user.email;

    const existingUser = await getUser(userId);
    if (existingUser) {
      return res.json(existingUser);
    }

    // Accept role from registration body — default to "client"
    const requestedRole = req.body?.role;
    const role = VALID_ROLES.includes(requestedRole) ? requestedRole : "client";

    const newUser = await createUser(userId, {
      email: cleanEmail(email || ""),
      role,
      createdAt: new Date()
    });

    // Set Firebase custom claim
    await admin.auth().setCustomUserClaims(userId, { role });

    res.json(newUser);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Own profile — return everything
    if (req.user.uid === req.params.id) {
      return res.json(user);
    }

    // Other user — return only public fields (name + email for display)
    return res.json({ name: user.name || null, email: user.email || null });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
