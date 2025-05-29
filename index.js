const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send("hi")
})
// POST /contact route
app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER, // your Gmail address
        pass: process.env.MAIL_PASS, // your App password (not normal Gmail password)
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.MAIL_USER,
      subject: "New Contact Form Submission",
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
