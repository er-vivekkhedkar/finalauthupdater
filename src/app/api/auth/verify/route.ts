// This file handles verification code validation
import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { pendingUsers } from "@/lib/pending-users";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    const lowerEmail = email.toLowerCase();
    
    console.log('Verifying:', { email: lowerEmail, code }); // Debug log
    console.log('Pending users:', pendingUsers); // Debug log
    
    const pendingUser = pendingUsers.get(lowerEmail);
    console.log('Found pending user:', pendingUser); // Debug log

    if (!pendingUser) {
      return NextResponse.json({ 
        success: false, 
        message: "No pending verification found" 
      });
    }

    if (pendingUser.verificationCode !== code) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid verification code" 
      });
    }

    if (pendingUser.expiresAt < new Date()) {
      pendingUsers.delete(lowerEmail);
      return NextResponse.json({ 
        success: false, 
        message: "Verification code has expired" 
      });
    }

    // Create the verified user in database
    await db.user.create({
      data: {
        email: lowerEmail,
        fullName: pendingUser.fullName,
        password: pendingUser.password,
        emailVerified: new Date(),
      }
    });

    // Clean up pending user
    pendingUsers.delete(lowerEmail);

    return NextResponse.json({ 
      success: true,
      message: "Email verified successfully" 
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Verification failed" 
    }, { status: 500 });
  }
} 