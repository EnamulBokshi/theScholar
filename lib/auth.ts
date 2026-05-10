import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import {
  generateEmailVerificationOtp,
  getEmailVerificationIdentifier,
  getEmailVerificationOtpExpiryDate,
  hashEmailVerificationOtp,
} from "./emailVerificationOtp";
import { randomUUID } from "crypto";
import transporter from "./mailTransport";

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log("Attempting to send verification email....!!");
      try {
        const otp = generateEmailVerificationOtp();
        const identifier = getEmailVerificationIdentifier(user.email);
        const hashedOtp = hashEmailVerificationOtp(user.email, otp);
        const expiresAt = getEmailVerificationOtpExpiryDate();

        await prisma.verification.deleteMany({
          where: { identifier },
        });

        await prisma.verification.create({
          data: {
            id: randomUUID(),
            identifier,
            value: hashedOtp,
            expiresAt,
          },
        });

        const info = await transporter.sendMail({
          from: `" ${process.env.USER_NAME} " <${process.env.APP_USER}>`,
          to: user.email,
          subject: "Your SkillBridge verification OTP",
          html: `
                
                <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification OTP</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    .header {
      background-color: #2563eb;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
      color: #333333;
      line-height: 1.6;
    }
    .content h2 {
      margin-top: 0;
      font-size: 20px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .verify-button {
      background-color: #2563eb;
      color: #ffffff;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
      display: inline-block;
    }
    .verify-button:hover {
      background-color: #1e4fd8;
    }
    .footer {
      background-color: #f4f6f8;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #666666;
    }
    .link {
      word-break: break-all;
      color: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Email Verification OTP</h1>
    </div>

    <div class="content">
      <h2>Hello ${user.name}</h2>
      <p>
        Thank you for registering with us. Use the OTP below to verify your
        email address.
      </p>

      <div class="button-container">
        <span class="verify-button">${otp}</span>
      </div>

      <p>
        This OTP will expire in 10 minutes. If you did not create an account,
        you can safely ignore this email.
      </p>

      <p>
        Regards,<br />
        <strong>TheScolar</strong>
      </p>
    </div>

    <div class="footer">
      © 2025 TheScolar. All rights reserved.
    </div>
  </div>
</body>
</html>

                
                `,
        });
        console.log("Verification email sent successfully");
        console.log("info: ", info);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },

  advanced: {
    cookiePrefix: "better-auth",

    useSecureCookies: process.env.NODE_ENV === "production",

    crossSubDomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    },
    disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});
