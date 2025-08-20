const nodemailer = require("nodemailer");

const host   = process.env.SMTP_HOST;
const port   = Number(process.env.SMTP_PORT || 465);
const secure = String(process.env.SMTP_SECURE) !== "false"; // true for 465, false for 587
const user   = process.env.SMTP_USER;
const pass   = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  host, port, secure, auth: { user, pass }
});

exports.handler = async (event) => {
  // GET /api/design-request -> health + env present + SMTP verify (no email sent)
  if (event.httpMethod === "GET") {
    try {
      const verified = (user && pass && host) ? await transporter.verify() : false;
      return json(200, {
        ok: true,
        env: { host: !!host, port, secure, user: !!user, pass: !!pass },
        smtpVerified: !!verified
      });
    } catch (e) {
      return json(200, {
        ok: false,
        env: { host: !!host, port, secure, user: !!user, pass: !!pass },
        smtpVerified: false,
        error: String(e)
      });
    }
  }

  if (event.httpMethod !== "POST") return txt(405, "Method Not Allowed");

  try {
    const data = safeJSON(event.body);

    // IMPORTANT for Gmail: from should be your Gmail unless you've added a "Send mail as" alias in Gmail settings.
    const from    = process.env.SMTP_FROM || user;
    const to      = process.env.SMTP_TO || user;
    const replyTo = process.env.SMTP_REPLY_TO || to;

    // Verify SMTP first so failures are explicit
    await transporter.verify();

    await transporter.sendMail({
      from,
      to,
      replyTo,
      subject: "Dixon3D – New Design Request",
      text: `Name: ${data.name || "-"}\nEmail: ${data.email || "-"}\nMaterial: ${data.material || "-"}\nColor: ${data.color || "-"}\nQuantity: ${data.quantity || 1}\n\nNotes:\n${data.notes || "-"}`,
      html: `<h2>New Design Request</h2>
             <p><b>Name:</b> ${esc(data.name)}</p>
             <p><b>Email:</b> ${esc(data.email)}</p>
             <p><b>Material:</b> ${esc(data.material)}</p>
             <p><b>Color:</b> ${esc(data.color)}</p>
             <p><b>Quantity:</b> ${esc(String(data.quantity || 1))}</p>
             <p><b>Notes:</b><br>${esc(data.notes).replace(/\n/g,"<br>")}</p>`
    });

    return json(200, { ok: true });
  } catch (err) {
    // This comes back to your front-end; also check Netlify → Functions → Logs
    return json(500, { error: String(err) });
  }
};

function json(status, body) {
  return { statusCode: status, headers: { "content-type": "application/json" }, body: JSON.stringify(body) };
}
function txt(status, body) {
  return { statusCode: status, headers: { "content-type": "text/plain" }, body };
}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function safeJSON(s){ try { return JSON.parse(s || "{}"); } catch { return {}; } }
