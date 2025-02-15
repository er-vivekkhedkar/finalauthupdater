// This file handles sending emails using nodemailer
import nodemailer from 'nodemailer';

// Create reusable transporter with connection pooling
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  pool: true, // Use pooled connections
  maxConnections: 3, // Maintain up to 3 connections
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log("Email service error:", error);
  } else {
    console.log("Email server is ready");
  }
});

export async function sendVerificationEmail(email: string, token: string) {
  // Always use your domain URL, not Vercel's URL
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;
  
  const mailOptions = {
    from: `"Auth Verification" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email',
    priority: 'high' as const, // Fix type error
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
        <p style="color: #666; text-align: center;">Click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #666; text-align: center;">This link will expire in 24 hours.</p>
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