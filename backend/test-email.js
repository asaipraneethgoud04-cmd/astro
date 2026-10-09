/**
 * TalkAstrologer - Email Template Test Runner (Node.js)
 * Usage:
 *   node backend/test-email.js <recipient_email> [template_name]
 *
 * Examples:
 *   node backend/test-email.js myemail@gmail.com appointment-client
 *   node backend/test-email.js myemail@gmail.com confirmed
 *   node backend/test-email.js myemail@gmail.com contact-client
 *   node backend/test-email.js myemail@gmail.com all
 */

const mailer = require("./mailer.js");

const targetEmail = process.argv[2];
const templateChoice = (process.argv[3] || "appointment-client").toLowerCase();

if (!targetEmail) {
  console.log(`
=============================================================
  TalkAstrologer Animated Email Tester (Node.js)
=============================================================
Usage:
  node backend/test-email.js <your_email@gmail.com> [template]

Available Templates:
  - appointment-client  (Client booking receipt with rotating astrology wheel video background)
  - appointment-admin   (Admin alert with cosmic nebula background)
  - confirmed           (Official scheduled consultation confirmation)
  - contact-client      (Client inquiry receipt)
  - contact-admin       (Support desk inquiry notification)
  - all                 (Dispatches all 5 test emails)
=============================================================
`);
  process.exit(1);
}

console.log(`\n🚀 Starting Email Dispatch to: ${targetEmail} [Template: ${templateChoice}]...\n`);

async function run() {
  const sampleAppointment = {
    fullName: "Praneeth Goud",
    secondName: "Pooja Sharma",
    email: targetEmail,
    phone: "+1 (972) 555-0199",
    city: "Dallas / Frisco, Texas",
    service: "Vedic Kundali & Horoscope Reading",
    message: "Seeking guidance on career transition and auspicious timing for starting a new venture.",
  };

  const sampleContact = {
    name: "Praneeth Goud",
    email: targetEmail,
    phone: "+1 (972) 555-0199",
    subject: "Auspicious Timing Inquiry",
    message: "Namaste Master Vijay Ji, I would like to inquire about auspicious Mahurat timings for our upcoming housewarming ceremony.",
  };

  const sampleConfirmed = {
    clientName: "Praneeth Goud",
    clientEmail: targetEmail,
    clientPhone: "+1 (972) 555-0199",
    secondName: "Pooja Sharma",
    service: "Vedic Kundali & Horoscope Reading",
    scheduledTime: "Saturday, 11:00 AM CST (Dallas Time)",
    sessionMedium: "Google Meet / Direct WhatsApp Video",
    meetingLinkOrInstructions: "https://meet.google.com/ast-ro-vedic",
    customNote: "Master Vijay Ji recommends keeping your accurate birth time and birthplace documents ready before joining.",
  };

  try {
    if (templateChoice === "appointment-client" || templateChoice === "all") {
      console.log("📤 Sending [Appointment Client Receipt]...");
      const res = await mailer.sendAppointmentNotificationEmail(sampleAppointment);
      console.log("   Result:", res);
    }

    if (templateChoice === "appointment-admin" || templateChoice === "all") {
      console.log("📤 Sending [Appointment Admin Alert] (routed to recipient for testing)...");
      const adminAppointment = { ...sampleAppointment, email: targetEmail };
      const res = await mailer.sendAppointmentNotificationEmail(adminAppointment);
      console.log("   Result:", res);
    }

    if (templateChoice === "confirmed" || templateChoice === "all") {
      console.log("📤 Sending [Confirmed Consultation Schedule]...");
      const res = await mailer.sendAppointmentConfirmedEmail(sampleConfirmed);
      console.log("   Result:", res);
    }

    if (templateChoice === "contact-client" || templateChoice === "all") {
      console.log("📤 Sending [Contact Client Receipt]...");
      const res = await mailer.sendContactNotificationEmail(sampleContact);
      console.log("   Result:", res);
    }

    if (templateChoice === "contact-admin" || templateChoice === "all") {
      console.log("📤 Sending [Contact Support Admin Alert]...");
      const res = await mailer.sendContactNotificationEmail(sampleContact);
      console.log("   Result:", res);
    }

    console.log("\n✨ Test dispatch sequence completed!");
  } catch (err) {
    console.error("\n❌ Error during dispatch:", err.message);
  }
}

run();
