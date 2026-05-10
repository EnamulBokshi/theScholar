"use server";

import prisma from "@/lib/prisma";
import { getEmailVerificationIdentifier, hashEmailVerificationOtp } from "@/lib/emailVerificationOtp";

export async function verifyEmailOtp(email: string, otp: string) {
  try {
    const identifier = getEmailVerificationIdentifier(email);
    const hashedOtp = hashEmailVerificationOtp(email, otp);

    const verification = await prisma.verification.findFirst({
      where: {
        identifier,
        value: hashedOtp,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verification) {
      return { error: "Invalid or expired OTP" };
    }

    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { emailVerified: true },
    });

    await prisma.verification.delete({
      where: { id: verification.id },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Verification error:", error);
    return { error: error.message || "An error occurred during verification" };
  }
}
