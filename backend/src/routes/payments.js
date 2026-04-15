import express from "express";
import { stripe } from "../services/stripe.js";
import { authenticate } from "../middleware/auth.js";
import { getLawyerById } from "../services/lawyers.js";

const router = express.Router();

router.post("/create-intent", authenticate, async (req, res) => {
  try {
    const { lawyerId } = req.body;

    if (!lawyerId) {
      return res.status(400).json({ error: "lawyerId is required" });
    }

    const lawyer = await getLawyerById(lawyerId);
    if (!lawyer) return res.status(404).json({ error: "Lawyer not found" });

    const amount = lawyer.hourlyRate * 100;

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error("Create payment intent error:", err);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

export default router;
