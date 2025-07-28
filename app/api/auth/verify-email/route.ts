import { NextRequest, NextResponse } from "next/server";
import { verifyEmail } from "@/server/action/auth/verifyEmail";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token requis" },
        { status: 400 }
      );
    }

    const result = await verifyEmail(token);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erreur API vérification email:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
