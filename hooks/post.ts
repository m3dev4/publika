import { usePostStore } from "@/app/api/store/post.store";
import { Post } from "@/types/post.type";
import { useMutation } from "@tanstack/react-query";

// Interface pour les données du formulaire
export interface CreatePostData {
  title: string;
  content: string;
  type: "GENERAL" | "MISSION";
  categoryId: string;
  photos: string[];
  price?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export const UseCreatePost = () => {
  const { addPost, setLoading, setError } = usePostStore();

  return useMutation({
    mutationKey: ['createPost'],
    mutationFn: async (data: CreatePostData): Promise<Post> => {
      setLoading(true);
      setError(null);

      try {
        // Créer FormData (pas JSON) car ton API attend FormData
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("type", data.type);
        formData.append("categoryId", data.categoryId);
        formData.append("photos", JSON.stringify(data.photos));
        if (data.price) {
          formData.append("price", data.price.toString());
        }
        formData.append("status", data.status || "DRAFT");

        const res = await fetch("/api/post/createPost", {
          method: "POST",
          body: formData, // FormData, pas JSON
          credentials: "include",
        });

        const result = await res.json(); // JSON, pas formData()

        if (!res.ok) {
          throw new Error(result.error || "Erreur lors de la création");
        }

        // Ajouter au store
        addPost(result.post);
        setLoading(false);
        return result.post;
      } catch (error: any) {
        setLoading(false);
        setError(error.message);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Post créé avec succès!");
    },
    onError: (error: any) => {
      console.error("Erreur création post:", error.message);
    },
  });
};
