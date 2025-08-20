const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const {
      name = "",
      email = "",
      material = "",
      color = "",
      quantity = "",
      finish = "",
      notes = "",
      files = [],
      time = "",
    } = data;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const text = `New design request\n\nName: ${name}\nEmail: ${email}\nMaterial: ${material}\nColor: ${color}\nQuantity: ${quantity}\nFinish: ${finish}\nNotes: ${notes}\nFiles: ${files.join(", ")}\nTime: ${time}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "ThomasDixon@dixon3d.com",
      subject: "New Design Request",
      text,
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};

