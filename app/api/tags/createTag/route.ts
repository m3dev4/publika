import { createTag } from "@/server/action/tags/createTag";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, categoryId } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: "Nom et ID de la catégorie sont requis" }, { status: 400 });
    }

    const tag = await createTag({ name, categoryId });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json({ error: "Erreur lors de la création du tag" }, { status: 500 });
  }
}
