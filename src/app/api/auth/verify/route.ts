// This file handles verification code validation
import { NextResponse } from "next/server";
import { getPendingUserByToken } from "@/lib/pending-users";
import { db } from "@/lib/db/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=invalid-token`
      );
    }

    const pendingUser = await getPendingUserByToken(token);

    if (!pendingUser) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=invalid-token`
      );
    }

    // Check if user already exists and is verified
    const existingUser = await db.user.findUnique({
      where: { email: pendingUser.email }
    });

    if (existingUser?.emailVerified) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=already-verified`
      );
    }

    // Update the existing user record instead of creating a new one
    await db.user.update({
      where: { email: pendingUser.email },
      data: {
        emailVerified: new Date(),
        verifyCode: null,
        verifyExpires: null
      }
    });

    // Redirect to sign-in page with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/sign-in?verified=true`
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=verification-failed`
    );
  }
} 