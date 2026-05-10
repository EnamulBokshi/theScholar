import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SENDER_SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_SENDER_SMTP_PORT) || 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_SENDER_SMTP_USER,
    pass: process.env.EMAIL_SENDER_SMTP_PASSWORD,
  },
});

export default transporter;