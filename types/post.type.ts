export type PostType = "GENERAL" | "MISSION";
export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Post {
  id: string;
  userId: string;
  categoryId?: string; // Optionnel
  title: string;
  content: string;
  type: PostType;
  status: PostStatus;
  prices?: number;
  photo?: string[]; // Array de strings pour multiple photos
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour la création de posts (sans les champs auto-générés)
export interface CreatePostInput {
  title: string;
  content: string;
  type: PostType;
  categoryId?: string | null;
  photo?: string[];
  status: PostStatus;
  prices?: number | null;
}
