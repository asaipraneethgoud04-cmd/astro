/**
 * ============================================================================
 * TALKASTROLOGER - EXPRESS.JS BACKEND SERVICE
 * ============================================================================
 * Express.js Backend API for managing Appointments, Contact Enquiries,
 * Reviews, and Admin operations with Hostinger Nodemailer integration.
 *
 * Can be run standalone: node backend/server.js
 * Or managed with PM2:   pm2 start backend/server.js --name "astro-api"
 * ============================================================================
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
const mailer = require("./mailer");

// Load local environment variables if available
function loadEnv() {
  try {
    const envPaths = [
      path.join(__dirname, ".env"),
      path.join(__dirname, ".env.local"),
      path.join(__dirname, "..", ".env.local"),
      path.join(__dirname, "..", ".env"),
      path.join(process.cwd(), ".env.local"),
      path.join(process.cwd(), ".env"),
    ];
    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        const lines = fs.readFileSync(p, "utf-8").split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eq = trimmed.indexOf("=");
          if (eq > 0) {
            const key = trimmed.slice(0, eq).trim();
            const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
            if (!process.env[key]) process.env[key] = val;
          }
        }
      }
    }
  } catch (err) {
    console.warn("[Backend Server] Note: could not auto-read .env file:", err.message);
  }
}
loadEnv();

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://drzkaogmktbrgoojnguw.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyemthb2dta3Ricmdvb2puZ3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NTYwMzksImV4cCI6MjEwNjIzMjAzOX0.18o8Ca4sG-0OZON0kl6ar8dNdG4CubpjrWt_iFRCJOE";
const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper: Email format validator
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

// ============================================================================
// EXPRESS APPLICATION SETUP
// ============================================================================

const app = express();

// Standard CORS & Body Parsers
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// BACKEND BUSINESS CONTROLLERS
// ============================================================================

const controllers = {
  // 1. Health & Status
  healthCheck: async (req, res) => {
    return res.status(200).json({
      status: "online",
      service: "TalkAstrologer Express.js Backend API",
      timestamp: new Date().toISOString(),
    });
  },

  // 2. Submit New Appointment
  createAppointment: async (req, res) => {
    try {
      const { fullName, secondName, email, phone, city, service, message, honeypot } = req.body || {};

      // Anti-bot check
      if (honeypot) return res.status(200).json({ ok: true });

      if (!fullName || fullName.trim().length < 2) {
        return res.status(400).json({ ok: false, error: "Full name is required." });
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ ok: false, error: "Valid email is required." });
      }
      if (!phone || phone.trim().length < 6) {
        return res.status(400).json({ ok: false, error: "Valid phone number is required." });
      }
      if (!city || city.trim().length < 2) {
        return res.status(400).json({ ok: false, error: "City is required." });
      }
      if (!service || service.trim().length < 2) {
        return res.status(400).json({ ok: false, error: "Service is required." });
      }

      const { data: result, error } = await supabase
        .from("appointments")
        .insert({
          full_name: fullName.trim(),
          second_name: secondName ? secondName.trim() : null,
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          city: city.trim(),
          service: service.trim(),
          message: message ? message.trim() : null,
          status: "new",
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ ok: false, error: error.message });
      }

      // Trigger Hostinger email notification (async non-blocking)
      mailer
        .sendAppointmentNotificationEmail({
          fullName: fullName.trim(),
          secondName: secondName ? secondName.trim() : null,
          email: email.trim(),
          phone: phone.trim(),
          city: city.trim(),
          service: service.trim(),
          message: message ? message.trim() : null,
        })
        .catch((e) => console.error("[Backend Server] Mail dispatch error:", e));

      return res.status(201).json({ ok: true, appointment: result });
    } catch (err) {
      return res.status(400).json({ ok: false, error: err.message });
    }
  },

  // 3. Submit Contact / Support Message
  createContactMessage: async (req, res) => {
    try {
      const { name, email, phone, subject, message, honeypot } = req.body || {};

      // Anti-bot check
      if (honeypot) return res.status(200).json({ ok: true });

      if (!name || name.trim().length < 2) {
        return res.status(400).json({ ok: false, error: "Name is required." });
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ ok: false, error: "Valid email is required." });
      }
      if (!message || message.trim().length < 5) {
        return res.status(400).json({ ok: false, error: "Message is required." });
      }

      const { data: result, error } = await supabase
        .from("contact_messages")
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone ? phone.trim() : null,
          subject: subject ? subject.trim() : "General Inquiry",
          message: message.trim(),
          status: "new",
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ ok: false, error: error.message });
      }

      // Trigger Support email notification (async non-blocking)
      mailer
        .sendContactNotificationEmail({
          name: name.trim(),
          email: email.trim(),
          phone: phone ? phone.trim() : null,
          subject: subject ? subject.trim() : "General Inquiry",
          message: message.trim(),
        })
        .catch((e) => console.error("[Backend Server] Support mail dispatch error:", e));

      return res.status(201).json({ ok: true, message: result });
    } catch (err) {
      return res.status(400).json({ ok: false, error: err.message });
    }
  },

  // 4. Fetch All Appointments (Admin)
  getAppointments: async (req, res) => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, appointments: data || [] });
  },

  // 5. Update Appointment Status (Admin)
  updateAppointmentStatus: async (req, res) => {
    try {
      const id = req.params.id;
      const {
        status,
        adminNotes,
        scheduledTime,
        sessionMedium,
        meetingLinkOrInstructions,
        customNote,
        sendConfirmationEmail,
      } = req.body || {};

      const updatePayload = {};
      if (status) updatePayload.status = status;
      if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;

      const { data: updated, error } = await supabase
        .from("appointments")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) return res.status(500).json({ ok: false, error: error.message });

      // If scheduled time provided or explicit confirmation email requested, trigger confirmation email
      if ((sendConfirmationEmail || (status === "scheduled" && scheduledTime)) && updated && updated.email) {
        mailer
          .sendAppointmentConfirmedEmail({
            clientName: updated.full_name,
            clientEmail: updated.email,
            clientPhone: updated.phone,
            secondName: updated.second_name,
            service: updated.service,
            scheduledTime: (scheduledTime || "To be coordinated").trim(),
            sessionMedium: sessionMedium || "Direct Phone / WhatsApp Call",
            meetingLinkOrInstructions: meetingLinkOrInstructions ? meetingLinkOrInstructions.trim() : "",
            customNote: customNote ? customNote.trim() : "",
          })
          .catch((e) => console.error("[Backend Server] Confirmation mail dispatch error:", e));
      }

      return res.status(200).json({ ok: true, appointment: updated });
    } catch (err) {
      return res.status(400).json({ ok: false, error: err.message });
    }
  },

  // 5b. Confirm Appointment & Dispatch Official Email (Admin)
  confirmAppointment: async (req, res) => {
    try {
      const id = req.params.id;
      const { scheduledTime, sessionMedium, meetingLinkOrInstructions, customNote, adminNotes } = req.body || {};

      if (!scheduledTime) {
        return res.status(400).json({ ok: false, error: "Scheduled time is required to confirm appointment." });
      }

      const updatePayload = { status: "scheduled" };
      if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;

      const { data: updated, error } = await supabase
        .from("appointments")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) return res.status(500).json({ ok: false, error: error.message });

      if (updated && updated.email) {
        mailer
          .sendAppointmentConfirmedEmail({
            clientName: updated.full_name,
            clientEmail: updated.email,
            clientPhone: updated.phone,
            secondName: updated.second_name,
            service: updated.service,
            scheduledTime: scheduledTime.trim(),
            sessionMedium: sessionMedium || "Direct Phone / WhatsApp Call",
            meetingLinkOrInstructions: meetingLinkOrInstructions ? meetingLinkOrInstructions.trim() : "",
            customNote: customNote ? customNote.trim() : "",
          })
          .catch((e) => console.error("[Backend Server] Confirmation mail dispatch error:", e));
      }

      return res.status(200).json({
        ok: true,
        appointment: updated,
        message: "Appointment confirmed and notification email dispatched.",
      });
    } catch (err) {
      return res.status(400).json({ ok: false, error: err.message });
    }
  },

  // 6. Fetch All Contact Messages (Admin)
  getContactMessages: async (req, res) => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, messages: data || [] });
  },

  // 7. Update Contact Message Status (Admin)
  updateMessageStatus: async (req, res) => {
    try {
      const id = req.params.id;
      const { status, adminNotes } = req.body || {};

      const updatePayload = {};
      if (status) updatePayload.status = status;
      if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;

      const { data: updated, error } = await supabase
        .from("contact_messages")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) return res.status(500).json({ ok: false, error: error.message });
      return res.status(200).json({ ok: true, message: updated });
    } catch (err) {
      return res.status(400).json({ ok: false, error: err.message });
    }
  },

  // 8. Fetch Reviews
  getReviews: async (req, res) => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, reviews: data || [] });
  },

  // 9. Moderate Review (Admin)
  moderateReview: async (req, res) => {
    try {
      const id = req.params.id;
      const { status, pinned } = req.body || {};

      const updatePayload = {};
      if (status) updatePayload.status = status;
      if (pinned !== undefined) updatePayload.pinned = Boolean(pinned);

      const { data: updated, error } = await supabase
        .from("reviews")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) return res.status(500).json({ ok: false, error: error.message });
      return res.status(200).json({ ok: true, review: updated });
    } catch (err) {
      return res.status(400).json({ ok: false, error: err.message });
    }
  },
};

// ============================================================================
// EXPRESS ROUTES
// ============================================================================

// 1. Health
app.get("/api/health", controllers.healthCheck);

// 2. Appointments
app.post("/api/appointments", controllers.createAppointment);
app.get("/api/appointments", controllers.getAppointments);
app.patch("/api/appointments/:id", controllers.updateAppointmentStatus);
app.post("/api/appointments/:id/confirm", controllers.confirmAppointment);

// 3. Contact Messages
app.post("/api/messages", controllers.createContactMessage);
app.get("/api/messages", controllers.getContactMessages);
app.patch("/api/messages/:id", controllers.updateMessageStatus);

// 4. Reviews
app.get("/api/reviews", controllers.getReviews);
app.patch("/api/reviews/:id", controllers.moderateReview);

// 5. 404 Handler
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Endpoint not found" });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Backend Server Error]", err);
  res.status(err.status || 500).json({
    ok: false,
    error: err.message || "Internal server error",
  });
});

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[TalkAstrologer Backend] Express server running on port ${PORT}`);
  });
}

module.exports = { app, server: app, controllers };
