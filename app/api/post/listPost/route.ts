import { listPost } from "@/server/action/post/listPost";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const post = await listPost();
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 },
    );
  }
}
