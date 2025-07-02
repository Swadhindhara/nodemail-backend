const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
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
  const { name, email, number, loanRequired, pincode, preferredDestination, preferredIntake, preferredProgram} = req.body;

  try {
    const templatePath = path.join(__dirname, "templates", "index.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders globally
    htmlTemplate = htmlTemplate
      .replace(/{{name}}/g, name)
      .replace(/{{email}}/g, email)
      .replace(/{{number}}/g, number)
      .replace(/{{loanRequired}}/g, loanRequired)
      .replace(/{{pincode}}/g, pincode)
      .replace(/{{preferredDestination}}/g, preferredDestination)
      .replace(/{{preferredIntake}}/g, preferredIntake)
      .replace(/{{preferredProgram}}/g, preferredProgram);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.MAIL_USER,
      subject: "New Contact Form Submission",
      html: htmlTemplate,
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
