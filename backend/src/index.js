import "./config/env.js";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import paymentsRouter from "./routes/payments.js";
import userRoutes from "./routes/users.js";
import lawyerRoutes from "./routes/lawyers.js";
import appointmentRoutes from "./routes/appointments.js";
import paymentConfirmRoutes from "./routes/payments-confirm.js";
import webhookRoutes from "./routes/webhooks.js";
import callRoutes from "./routes/calls.js";
import availabilityRoutes from "./routes/availability.js";
import adminRoutes from "./routes/admin.js";
import { authenticate } from "./middleware/auth.js";
import { startNotificationCron } from "./services/notificationCron.js";

const app = express();

// ── CORS ──
const allowedOrigins = [
  "http://localhost:5173",
  "https://oncall-lawyer-api-dev.web.app",
  "https://oncall-lawyer-api-dev.firebaseapp.com",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));

// ── RATE LIMITERS ──

// General API limit — 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Intente más tarde. · Too many requests, please try again later." },
});

// Auth endpoints — 10 attempts per 15 minutes per IP
// Prevents brute force on login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de autenticación. Espere 15 minutos. · Too many auth attempts. Wait 15 minutes." },
});

// Booking limit — 20 bookings per hour per IP
// Prevents appointment spam
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas citas creadas. Intente más tarde. · Too many bookings created. Try again later." },
});

// Payment limit — 20 payment intents per hour per IP
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes de pago. Intente más tarde. · Too many payment requests. Try again later." },
});

// Email/notification limit — 5 per hour per IP
// Prevents spam via the forgot password or notification triggers
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes de correo. Intente más tarde. · Too many email requests. Try again later." },
});

// ── ROUTES ──

// Webhook must be before express.json()
app.use("/webhooks", webhookRoutes);

app.use(express.json());

// Apply general limiter to all routes
app.use(generalLimiter);

// Auth — strict limit on POST only (registration/login sync), general on GET
app.post("/users", authLimiter);
app.use("/users", userRoutes);

// Bookings — booking limit
app.use("/appointments", bookingLimiter, appointmentRoutes);

// Payments — payment limit
app.use("/payments", paymentLimiter, paymentsRouter);
app.use("/payments", paymentLimiter, paymentConfirmRoutes);

// Calls — general limit (already applied)
app.use("/calls", callRoutes);

// Lawyers & availability — general limit (already applied)
app.use("/lawyers", lawyerRoutes);
app.use("/availability", availabilityRoutes);

// Admin routes
app.use("/admin", adminRoutes);

// Health checks — no rate limit needed
app.get("/", (req, res) => res.send("Lawyer API is running 🚀"));
app.get("/health", (req, res) => res.send("API is healthy"));

app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startNotificationCron();
});
