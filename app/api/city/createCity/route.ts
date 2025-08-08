import { createCitie } from "@/server/action/cities/createCitie";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, regionId, longitude, latitude } = body;

    if (!name || !regionId) {
      return NextResponse.json(
        { error: "Name and regionId are required" },
        { status: 400 },
      );
    }

    const city = await createCitie({
      name,
      regionId,
      longitude: longitude ? parseFloat(longitude) : undefined,
      latitude: latitude ? parseFloat(latitude) : undefined,
    });

    return NextResponse.json({ city }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating city:", error);
    return NextResponse.json(
      { error: error.message || "Error creating city" },
      { status: 500 },
    );
  }
}
