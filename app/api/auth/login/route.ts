import { NextRequest, NextResponse } from "next/server";
import { login } from "@/server/action/auth/login";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const user = await login({ email, password }, request);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la connexion" },
      { status: 400 }
    );
  }
}
