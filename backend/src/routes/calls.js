import express from "express";
import { authenticate } from "../middleware/auth.js";
import { db } from "../services/firestore.js";

const router = express.Router();
const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_BASE_URL = "https://api.daily.co/v1";

async function dailyFetch(path, method = "GET", body = null) {
  const res = await fetch(`${DAILY_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Daily.co error: ${err}`);
  }
  return res.json();
}

router.post("/create-room", authenticate, async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ error: "appointmentId is required" });
    }

    const doc = await db.collection("appointments").doc(appointmentId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const appointment = doc.data();

    if (appointment.clientId !== req.user.uid && appointment.lawyerId !== req.user.uid) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (appointment.roomUrl) {
      return res.json({ roomUrl: appointment.roomUrl });
    }

    const scheduledAt = appointment.scheduledAt?.toDate
      ? appointment.scheduledAt.toDate()
      : new Date(appointment.scheduledAt);

    const expiry = Math.floor(scheduledAt.getTime() / 1000) + 60 * 60 * 2;

    const room = await dailyFetch("/rooms", "POST", {
      name: `oncall-${appointmentId}`,
      properties: {
        exp: expiry,
        enable_chat: true,
        enable_screenshare: true,
        start_video_off: false,
        start_audio_off: false,
      },
    });

    await db.collection("appointments").doc(appointmentId).update({
      roomUrl: room.url,
      roomName: room.name,
      callStatus: "ready",
    });

    res.json({ roomUrl: room.url });
  } catch (err) {
    console.error("Create room error:", err);
    res.status(500).json({ error: "Failed to create call room" });
  }
});

router.post("/token", authenticate, async (req, res) => {
  try {
    const { roomName, isOwner } = req.body;

    if (!roomName) {
      return res.status(400).json({ error: "roomName is required" });
    }

    const token = await dailyFetch("/meeting-tokens", "POST", {
      properties: {
        room_name: roomName,
        is_owner: isOwner === true,
        user_name: req.user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
      },
    });

    res.json({ token: token.token });
  } catch (err) {
    console.error("Create token error:", err);
    res.status(500).json({ error: "Failed to create call token" });
  }
});

export default router;
