import { NextRequest, NextResponse } from "next/server";
import { onboarding } from "@/server/action/onboarding/onboarding";

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Payload reçu pour onboarding:", data);
    const result = await onboarding(data);
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Erreur API onboarding:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
