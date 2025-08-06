import { Tag } from "@/types/category.types";
import { useMutation } from "@tanstack/react-query";

export const createTag = () => {
  return useMutation({
    mutationFn: async (tag: { name: string; categoryId: string }) => {
      const res = await fetch("/api/tag", {
        method: "POST",
        body: JSON.stringify(tag),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to create tag");
      }
      return res.json();
    },
  });
};