import { listCity } from "@/server/action/cities/listCity";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cities = await listCity();
    return NextResponse.json({ cities }, { status: 200 });
  } catch (error) {
    console.error("Error listing cities:", error);
    return NextResponse.json(
      { error: "Error listing cities" },
      { status: 500 },
    );
  }
}
