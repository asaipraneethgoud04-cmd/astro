/**
 * ============================================================================
 * TALKASTROLOGER - STANDALONE NODE.JS BACKEND SERVICE
 * ============================================================================
 * Pure Node.js Backend API for managing Appointments, Contact Enquiries,
 * Reviews, and Admin operations without Nodemailer coupling.
 *
 * Can be run standalone: node backend/server.js
 * Or imported as a module in any Node.js service.
 * ============================================================================
 */

const http = require("http");
const { createClient } = require("@supabase/supabase-js");
const mailer = require("./mailer");

// Load Environment Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://drzkaogmktbrgoojnguw.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyemthb2dta3Ricmdvb2puZ3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NTYwMzksImV4cCI6MjEwNjIzMjAzOX0.18o8Ca4sG-0OZON0kl6ar8dNdG4CubpjrWt_iFRCJOE";
const PORT = process.env.BACKEND_PORT || 5000;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper: Standard JSON Response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(data));
}

// Helper: Parse Request Body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
  });
}

// Helper: Email format validator
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

// ============================================================================
// BACKEND BUSINESS CONTROLLERS (Pure Node.js)
// ============================================================================

const controllers = {
  // 1. Health & Status
  healthCheck: async (req, res) => {
    sendJson(res, 200, {
      status: "online",
      service: "TalkAstrologer Node.js Backend API",
      timestamp: new Date().toISOString(),
    });
  },

  // 2. Submit New Appointment
  createAppointment: async (req, res) => {
    try {
      const data = await parseBody(req);
      const { fullName, secondName, email, phone, city, service, message, honeypot } = data;

      // Anti-bot check
      if (honeypot) return sendJson(res, 200, { ok: true });

      if (!fullName || fullName.trim().length < 2) {
        return sendJson(res, 400, { ok: false, error: "Full name is required." });
      }
      if (!isValidEmail(email)) {
        return sendJson(res, 400, { ok: false, error: "Valid email is required." });
      }
      if (!phone || phone.trim().length < 6) {
        return sendJson(res, 400, { ok: false, error: "Valid phone number is required." });
      }
      if (!city || city.trim().length < 2) {
        return sendJson(res, 400, { ok: false, error: "City is required." });
      }
      if (!service || service.trim().length < 2) {
        return sendJson(res, 400, { ok: false, error: "Service is required." });
      }

      const { data: result, error } = await supabase.from("appointments").insert({
        full_name: fullName.trim(),
        second_name: secondName ? secondName.trim() : null,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        city: city.trim(),
        service: service.trim(),
        message: message ? message.trim() : null,
        status: "new",
      }).select().single();

      if (error) {
        return sendJson(res, 500, { ok: false, error: error.message });
      }

      // Trigger Hostinger email notification (async non-blocking)
      mailer.sendAppointmentNotificationEmail({
        fullName: fullName.trim(),
        secondName: secondName ? secondName.trim() : null,
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        service: service.trim(),
        message: message ? message.trim() : null,
      }).catch((e) => console.error("[Backend Server] Mail dispatch error:", e));

      return sendJson(res, 201, { ok: true, appointment: result });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  },

  // 3. Submit Contact / Support Message
  createContactMessage: async (req, res) => {
    try {
      const data = await parseBody(req);
      const { name, email, phone, subject, message, honeypot } = data;

      // Anti-bot check
      if (honeypot) return sendJson(res, 200, { ok: true });

      if (!name || name.trim().length < 2) {
        return sendJson(res, 400, { ok: false, error: "Name is required." });
      }
      if (!isValidEmail(email)) {
        return sendJson(res, 400, { ok: false, error: "Valid email is required." });
      }
      if (!message || message.trim().length < 5) {
        return sendJson(res, 400, { ok: false, error: "Message is required." });
      }

      const { data: result, error } = await supabase.from("contact_messages").insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        subject: subject ? subject.trim() : "General Inquiry",
        message: message.trim(),
        status: "new",
      }).select().single();

      if (error) {
        return sendJson(res, 500, { ok: false, error: error.message });
      }

      // Trigger Support email notification (async non-blocking)
      mailer.sendContactNotificationEmail({
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        subject: subject ? subject.trim() : "General Inquiry",
        message: message.trim(),
      }).catch((e) => console.error("[Backend Server] Support mail dispatch error:", e));

      return sendJson(res, 201, { ok: true, message: result });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  },

  // 4. Fetch All Appointments (Admin)
  getAppointments: async (req, res) => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return sendJson(res, 500, { ok: false, error: error.message });
    return sendJson(res, 200, { ok: true, appointments: data || [] });
  },

  // 5. Update Appointment Status (Admin)
  updateAppointmentStatus: async (req, res, id) => {
    try {
      const data = await parseBody(req);
      const { status, adminNotes } = data;

      const updatePayload = {};
      if (status) updatePayload.status = status;
      if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;

      const { data: updated, error } = await supabase
        .from("appointments")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) return sendJson(res, 500, { ok: false, error: error.message });
      return sendJson(res, 200, { ok: true, appointment: updated });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  },

  // 6. Fetch All Contact Messages (Admin)
  getContactMessages: async (req, res) => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return sendJson(res, 500, { ok: false, error: error.message });
    return sendJson(res, 200, { ok: true, messages: data || [] });
  },

  // 7. Update Contact Message Status (Admin)
  updateMessageStatus: async (req, res, id) => {
    try {
      const data = await parseBody(req);
      const { status, adminNotes } = data;

      const updatePayload = {};
      if (status) updatePayload.status = status;
      if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;

      const { data: updated, error } = await supabase
        .from("contact_messages")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) return sendJson(res, 500, { ok: false, error: error.message });
      return sendJson(res, 200, { ok: true, message: updated });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  },

  // 8. Fetch Reviews
  getReviews: async (req, res) => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return sendJson(res, 500, { ok: false, error: error.message });
    return sendJson(res, 200, { ok: true, reviews: data || [] });
  },

  // 9. Moderate Review (Admin)
  moderateReview: async (req, res, id) => {
    try {
      const data = await parseBody(req);
      const { status, pinned } = data;

      const updatePayload = {};
      if (status) updatePayload.status = status;
      if (pinned !== undefined) updatePayload.pinned = Boolean(pinned);

      const { data: updated, error } = await supabase
        .from("reviews")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) return sendJson(res, 500, { ok: false, error: error.message });
      return sendJson(res, 200, { ok: true, review: updated });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  },
};

// ============================================================================
// HTTP ROUTER
// ============================================================================

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  // Routes:
  if (pathname === "/api/health" && method === "GET") {
    return controllers.healthCheck(req, res);
  }

  if (pathname === "/api/appointments" && method === "POST") {
    return controllers.createAppointment(req, res);
  }

  if (pathname === "/api/appointments" && method === "GET") {
    return controllers.getAppointments(req, res);
  }

  const apptMatch = pathname.match(/^\/api\/appointments\/([a-zA-Z0-9-]+)$/);
  if (apptMatch && method === "PATCH") {
    return controllers.updateAppointmentStatus(req, res, apptMatch[1]);
  }

  if (pathname === "/api/messages" && method === "POST") {
    return controllers.createContactMessage(req, res);
  }

  if (pathname === "/api/messages" && method === "GET") {
    return controllers.getContactMessages(req, res);
  }

  const msgMatch = pathname.match(/^\/api\/messages\/([a-zA-Z0-9-]+)$/);
  if (msgMatch && method === "PATCH") {
    return controllers.updateMessageStatus(req, res, msgMatch[1]);
  }

  if (pathname === "/api/reviews" && method === "GET") {
    return controllers.getReviews(req, res);
  }

  const revMatch = pathname.match(/^\/api\/reviews\/([a-zA-Z0-9-]+)$/);
  if (revMatch && method === "PATCH") {
    return controllers.moderateReview(req, res, revMatch[1]);
  }

  // Not Found
  sendJson(res, 404, { ok: false, error: "Endpoint not found" });
});

// Start server if executed directly
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[TalkAstrologer Backend] Server running on http://localhost:${PORT}`);
  });
}

module.exports = { server, controllers };
