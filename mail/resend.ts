import resend from "@/config/resend.config";
import { EmailVerificationTemplate } from "@/templates/authEmailVerification";

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Publika <onboarding@resend.dev>", // Utilisez le domaine par défaut de Resend
      to: email,
      subject: "Vérifiez votre adresse email - Publika",
      html: EmailVerificationTemplate({ email, token }), // HTML au lieu de React
    });

    if (error) {
      throw new Error("Failed to send verification email");
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
