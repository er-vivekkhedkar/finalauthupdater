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

    const pendingData = await getPendingUserByToken(token);

    if (!pendingData?.user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=invalid-token`
      );
    }

    // Update user to verified status
    await db.user.update({
      where: { id: pendingData.user.id },
      data: {
        emailVerified: new Date()
      }
    });

    // Clean up verification code
    await db.verifyCode.delete({
      where: { id: pendingData.id }
    });

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