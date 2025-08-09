import { getPostById } from "@/server/action/post/getPostById";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const post = await getPostById(id);
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}
