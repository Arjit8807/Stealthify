import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    if (!email || !username || !verifyCode) {
      return { success: false, message: "Missing required fields." };
    }

    // Nodemailer transport configuration for SMTP
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Use 587 for TLS, 465 for SSL
      secure: true, // true for SSL, false for TLS
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Stealthify" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Stealthify | Verification Code",
      headers: {
        "List-Unsubscribe": `<mailto:${process.env.EMAIL_USERNAME}>`,
      },
      html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Hello, ${username}!</h2>
            <p>Your verification code for Stealthify is:</p>
            <h3 style="color: green;">${verifyCode}</h3>
            <p>Please enter this code on the website to verify your email.</p>
            <p>Thank you!</p>
            <p style="font-size: 12px; color: gray;">
              Stealthify | Your Company Address | <a href="mailto:${process.env.EMAIL_USERNAME}">Contact Support</a>
            </p>
            <p style="font-size: 12px; color: gray;">If you didn’t request this, please ignore this email.</p>
          </div>
        </body>
      </html>
      `,
    };

    const result = await transport.sendMail(mailOptions);
    console.log("Email sent:", result);

    if (result.rejected.length > 0) {
      return { success: false, message: "Failed to send verification email." };
    }

    return { success: true, message: "Verification email sent successfully." };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email due to an internal error." };
  }
}
