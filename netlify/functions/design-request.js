const nodemailer = require("nodemailer");

const host   = process.env.SMTP_HOST;
const port   = Number(process.env.SMTP_PORT || 465);
const secure = String(process.env.SMTP_SECURE) !== "false"; // true for 465, false for 587
const user   = process.env.SMTP_USER;
const pass   = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

exports.handler = async (event) => {
  const traceId = safeId();

  // Health/diagnostics (GET)
  if (event.httpMethod === "GET") {
    try {
      const env = { host: !!host, port, secure, user: !!user, pass: !!pass };
      const verified = env.host && env.user && env.pass ? await transporter.verify() : false;
      return J(200, { ok: true, env, smtpVerified: !!verified, traceId });
    } catch (e) {
      return J(200, {
        ok: false,
        env: { host: !!host, port, secure, user: !!user, pass: !!pass },
        smtpVerified: false,
        code: classify(e).code,
        message: classify(e).message,
        traceId
      });
    }
  }

  if (event.httpMethod !== "POST") return T(405, "Method Not Allowed");

  // Fail fast if required envs missing (don’t attempt SMTP)
  const missing = ["SMTP_HOST","SMTP_USER","SMTP_PASS"].filter(k => !process.env[k]);
  if (missing.length) {
    const err = { code: "MISSING_ENV", message: `Missing env: ${missing.join(", ")}` };
    log(traceId, err);
    return J(500, { ok: false, ...err, traceId });
  }

  try {
    const data = safeJSON(event.body);

    // For Gmail: from should be the Gmail user unless you added a Send-As alias
    const from    = process.env.SMTP_FROM || user;
    const to      = process.env.SMTP_TO || user;
    const replyTo = process.env.SMTP_REPLY_TO || to;

    // Surface auth/host errors explicitly before send
    await transporter.verify();

    await transporter.sendMail({
      from, to, replyTo,
      subject: "Dixon3D – New Design Request",
      text:
`Name: ${data.name || "-"}
Email: ${data.email || "-"}
Material: ${data.material || "-"}
Color: ${data.color || "-"}
Quantity: ${data.quantity || 1}

Notes:
${data.notes || "-"}`,
      html: `<h2>New Design Request</h2>
             <p><b>Name:</b> ${esc(data.name)}</p>
             <p><b>Email:</b> ${esc(data.email)}</p>
             <p><b>Material:</b> ${esc(data.material)}</p>
             <p><b>Color:</b> ${esc(data.color)}</p>
             <p><b>Quantity:</b> ${esc(String(data.quantity || 1))}</p>
             <p><b>Notes:</b><br>${esc(data.notes).replace(/\n/g,"<br>")}</p>`
    });

    return J(200, { ok: true, traceId });
  } catch (e) {
    const info = classify(e);
    log(traceId, e);
    return J(500, { ok: false, code: info.code, message: info.message, traceId });
  }
};

/* ---------- helpers ---------- */
function classify(e){
  const msg = String(e && (e.message || e)) || "";
  const code = (e && e.code) || "";
  if (msg.includes("From address not owned"))       return { code: "FROM_NOT_OWNED",       message: "SMTP_FROM must be your Gmail address unless Gmail Send-As is configured." };
  if (msg.includes("No recipients defined"))        return { code: "NO_RECIPIENTS",        message: "SMTP_TO is missing/invalid." };
  if (code === "EAUTH" || msg.includes("Invalid login")) return { code: "SMTP_INVALID_LOGIN", message: "SMTP_USER or SMTP_PASS is wrong (use Gmail App password, no spaces)." };
  if (code === "ENOTFOUND")                         return { code: "SMTP_HOST_NOT_FOUND",  message: "SMTP_HOST is wrong (use smtp.gmail.com)." };
  if (code === "ECONNECTION")                       return { code: "SMTP_CONNECTION_FAIL", message: "Could not connect to SMTP host/port." };
  if (code === "ETIMEDOUT")                         return { code: "SMTP_TIMEOUT",         message: "SMTP connection timed out." };
  if (code === "EENVELOPE")                         return { code: "SMTP_BAD_ENVELOPE",    message: "From/To headers invalid." };
  return { code: code || "UNKNOWN", message: msg.slice(0, 300) };
}
function J(status, body){
  return { statusCode: status, headers: { "content-type": "application/json", "x-trace-id": body.traceId || "" }, body: JSON.stringify(body) };
}
function T(status, body){ return { statusCode: status, headers: { "content-type": "text/plain" }, body }; }
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function safeJSON(s){ try{ return JSON.parse(s||"{}"); } catch{ return {}; } }
function safeId(){ try { return require("crypto").randomUUID(); } catch { return "t"+Date.now().toString(36)+Math.random().toString(36).slice(2,7); } }
function log(t,e){ console.error(`[design-request][${t}]`, e); }
