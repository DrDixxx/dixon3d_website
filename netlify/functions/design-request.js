const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,                       // smtp.gmail.com
  port: Number(process.env.SMTP_PORT || 465),        // 465 or 587
  secure: String(process.env.SMTP_SECURE) !== "false", // true for 465, false for 587
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}"); // name, email, material, color, quantity, notes

    const html = `
      <h2>New Design Request</h2>
      <p><b>Name:</b> ${esc(data.name)}</p>
      <p><b>Email:</b> ${esc(data.email)}</p>
      <p><b>Material:</b> ${esc(data.material)}</p>
      <p><b>Color:</b> ${esc(data.color)}</p>
      <p><b>Quantity:</b> ${esc(String(data.quantity || 1))}</p>
      <p><b>Notes:</b><br>${esc(data.notes).replace(/\n/g,"<br>")}</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,                   // e.g. "Dixon3D <thomasdixon3d@gmail.com>"
      to: process.env.SMTP_TO,                       // e.g. "thomasdixon@dixon3d.com"
      replyTo: process.env.SMTP_REPLY_TO || process.env.SMTP_TO,
      subject: "Dixon3D – New Design Request",
      text:
`New request from ${data.name || "-"} (${data.email || "-"})
Material: ${data.material || "-"}
Color: ${data.color || "-"}
Quantity: ${data.quantity || 1}

Notes:
${data.notes || "-"}`,
      html
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};

function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
