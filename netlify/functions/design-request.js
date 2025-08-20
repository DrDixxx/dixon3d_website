const nodemailer = require("nodemailer");

const host   = process.env.SMTP_HOST;
const port   = Number(process.env.SMTP_PORT || 465);
const secure = String(process.env.SMTP_SECURE) !== "false";
const user   = process.env.SMTP_USER;
const pass   = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    try {
      const verified = (user && pass && host) ? await transporter.verify() : false;
      return J(200, { ok:true, env:{host:!!host,port,secure,user:!!user,pass:!!pass}, smtpVerified:!!verified });
    } catch (e) {
      return J(200, { ok:false, env:{host:!!host,port,secure,user:!!user,pass:!!pass}, smtpVerified:false, error:String(e) });
    }
  }
  if (event.httpMethod !== "POST") return T(405,"Method Not Allowed");

  try {
    const data = safeJSON(event.body);
    const from    = process.env.SMTP_FROM || user; // MUST be your Gmail unless you've set a Send-As alias
    const to      = process.env.SMTP_TO || user;
    const replyTo = process.env.SMTP_REPLY_TO || to;

    await transporter.verify(); // surface auth/host errors clearly

    // Send the simplest possible email first
    await transporter.sendMail({
      from, to, replyTo,
      subject: "Dixon3D – New Design Request",
      text: `Name: ${data.name||"-"}\nEmail: ${data.email||"-"}\nMaterial: ${data.material||"-"}\nColor: ${data.color||"-"}\nQuantity: ${data.quantity||1}\n\nNotes:\n${data.notes||"-"}`
    });

    return J(200, { ok:true });
  } catch (err) {
    // Also visible in Netlify → Functions → design-request → Logs
    return J(500, { error:String(err) });
  }
};

function J(status, body){ return { statusCode:status, headers:{ "content-type":"application/json" }, body: JSON.stringify(body) }; }
function T(status, body){ return { statusCode:status, headers:{ "content-type":"text/plain" }, body }; }
function safeJSON(s){ try{ return JSON.parse(s||"{}"); } catch{ return {}; } }
