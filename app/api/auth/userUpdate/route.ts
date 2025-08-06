import { updateUserProfile } from "@/server/action/users/updateUserProfile";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }
    
    const dataWithId = { ...body, id };
    const result = await updateUserProfile(dataWithId);

    if (!result.success) {
      return NextResponse.json({
        error: result.message,
        success: false,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      user: result.user,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur API updateProfile:", error);
    return NextResponse.json({
      error: error.message,
      success: false,
    }, { status: 500 });
  }
}
