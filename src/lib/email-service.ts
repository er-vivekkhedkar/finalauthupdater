// This file handles sending emails using nodemailer
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD  // Use app password, not regular password
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function sendVerificationEmail(email: string, code: string) {
  const mailOptions = {
    from: `"Auth Verification" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
        <p style="color: #666; text-align: center;">Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${code}</span>
        </div>
        <p style="color: #666; text-align: center;">This code will expire in 10 minutes.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 