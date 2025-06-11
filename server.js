require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Provera da li su sva polja popunjena
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ status: "error", message: 'Sva polja su obavezna.' });
  }

  // Konfigurisanje Gmail SMTP transportera
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    }
  });

  // Slanje mejla
  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.GMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: subject,
      text: `Ime: ${name}\nEmail: ${email}\nPoruka:\n${message}`,
      replyTo: email,
    });

    res.json({ status: "success", message: 'Mejl je uspešno poslat.' });
  } catch (err) {
    console.error("Greška u slanju mejla:", err);
    res.status(500).json({ status: "error", message: 'Greška prilikom slanja mejla.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server radi na portu ${PORT}`);
});
