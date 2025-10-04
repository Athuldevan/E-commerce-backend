const nodemailer = require("nodemailer");

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: 'athuldevan90@gmail.com',
    pass: process.env.SMTP_PASS,
  },
});