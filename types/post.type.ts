export type PostType = "GENERAL" | "MISSION";
export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Post {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  content: string;
  type: PostType;
  status: PostStatus;
  prices?: number;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}
