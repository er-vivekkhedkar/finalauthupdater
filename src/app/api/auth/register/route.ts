import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/db";
import { pendingUsers } from "@/lib/pending-users";
import { sendVerificationEmail } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();
    const lowerEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: lowerEmail }
    });

    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        message: "Email already registered" 
      });
    }

    // Generate random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 12);

    // Store pending user data
    pendingUsers.set(lowerEmail, {
      email: lowerEmail,
      password: hashedPassword,
      fullName,
      verificationCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    console.log('Pending users after registration:', pendingUsers); // Debug log

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to create account" 
    });
  }
} 