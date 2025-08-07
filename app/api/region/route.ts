import { getRegions } from "@/server/action/cities/getCities";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const regions = await getRegions();
    return NextResponse.json({ regions }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error fetching regions" },
      { status: 500 },
    );
  }
}
