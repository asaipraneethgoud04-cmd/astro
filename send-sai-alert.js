const nodemailer = require("nodemailer");

async function main() {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: "myappointment@TalkAstrologer",
      pass: "TalkAstrologer@1153#$",
    },
  });

  const info = await transporter.sendMail({
    from: '"TalkAstrologer" <myappointment@TalkAstrologer>',
    to: "myappointment@TalkAstrologer",
    subject: "[New Appointment] Consultation Request - Sai Praneeth",
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f3eb; margin: 0; padding: 25px 15px;">
          <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7d6bc; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
            <div style="background-color: #38070e; padding: 22px; text-align: center; border-bottom: 2px solid #d4af37;">
              <h1 style="color: #fcf9f2; margin: 0; font-size: 20px; font-weight: 700; text-transform: uppercase;">
                TalkAstrologer
              </h1>
              <p style="color: #f6e27a; margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">
                New Consultation Appointment Request
              </p>
            </div>
            <div style="padding: 24px;">
              <p style="color: #420813; font-size: 15px; margin-top: 0;">
                A new appointment request has been submitted:
              </p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; font-size: 13px; font-weight: 600; width: 35%;">Client Name</td>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #f0e6d6; color: #2a1114; font-size: 14px; font-weight: 700;">Sai Praneeth</td>
                </tr>
                <tr>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; font-size: 13px; font-weight: 600;">Status</td>
                  <td style="padding: 9px 12px; border-bottom: 1px solid #f0e6d6; color: #8b1827; font-size: 14px; font-weight: 700;">New (Pending Admin Scheduling)</td>
                </tr>
              </table>
              <div style="margin-top: 20px; text-align: center;">
                <a href="http://localhost:3000/admin/appointments" style="display: inline-block; background-color: #38070e; color: #f6e27a; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-size: 13px; border: 1px solid #d4af37;">
                  View &amp; Schedule in Admin Dashboard &rarr;
                </a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  console.log("Appointment alert delivered! Message ID:", info.messageId);
}

main().catch(console.error);
