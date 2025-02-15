import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/db";
import { createPendingUser } from '@/lib/pending-users';
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

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Store in temporary verification table
    const token = await createPendingUser({
      email: lowerEmail,
      password: hashedPassword,
      fullName
    });

    // Send verification email immediately
    await sendVerificationEmail(lowerEmail, token);

    return NextResponse.json({ 
      success: true,
      message: "Verification email sent" 
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to create account" 
    });
  }
} 