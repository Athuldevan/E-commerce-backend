const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false, 
  auth: {
    user: 'athuldevan90@gmail.com',
    pass: process.env.SMTP_PASS,
  },
});