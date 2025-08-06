import { updatePost } from "@/server/action/post/updatePost";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.formData();
    const title = body.get("title") as string;
    const content = body.get("content") as string;
    const type = body.get("type") as "GENERAL" | "MISSION";
    if (!type) {
      return NextResponse.json(
        { error: "Le champ type est requis" },
        { status: 400 },
      );
    }
    const categoryId = body.get("categoryId") as string;
    const photo = body.get("photo") as string;
    const status =
      (body.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "DRAFT";
    const prices = body.get("prices") as string;

    const post = {
      title,
      content,
      type,
      categoryId,
      photo,
      status,
      prices,
    };

    const updatedPost = await updatePost(params.id, post);
    return NextResponse.json({ updatedPost }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error updating post" }, { status: 500 });
  }
}
