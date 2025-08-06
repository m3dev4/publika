import { Posts } from "@/lib/prisma-client-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PostState {
  posts: Posts[];
  isLoading: boolean;
  error: string | null;

  //Actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setPosts: (posts: Posts[]) => void;
  addPost: (post: Posts) => void;
  updatePost: (id: string, post: Partial<Posts>) => void;
  removePost: (id: string) => void;
  filterPostByCategory: (categoryId: string) => void;
  searchPost: (searchTerm: string) => void;
  clearError: () => void;
  reset: () => void;
  getPostById: (id: string) => Posts | undefined;

  //Getters
  getPostByUserId: (userId: string) => Posts[];
  getPostByCategory: (categoryId: string) => Posts[];
  getPostByType: (type: string) => Posts[];
  getPostByStatus: (status: string) => Posts[];
}

const initialState = {
  posts: [],
  isLoading: false,
  error: null,
};

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      ...initialState,

      //Actions
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
      setPosts: (posts: Posts[]) => set({ posts }),
      addPost: (post: Posts) =>
        set((state) => ({ posts: [...state.posts, post] })),
      updatePost: (id: string, post: Partial<Posts>) =>
        set((state) => ({
          posts: state.posts.map((p) => (p.id === id ? { ...p, ...post } : p)),
        })),
      removePost: (id: string) =>
        set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),
      filterPostByCategory: (categoryId: string) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.categoryId === categoryId),
        })),
      searchPost: (searchTerm: string) =>
        set((state) => ({
          posts: state.posts.filter((p) =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        })),
      clearError: () => set({ error: null }),
      reset: () => set(initialState),
      getPostById: (id: string) => get().posts.find((p) => p.id === id),

      //Getters
      getPostByUserId: (userId: string) =>
        get().posts.filter((p) => p.userId === userId),
      getPostByCategory: (categoryId: string) =>
        get().posts.filter((p) => p.categoryId === categoryId),
      getPostByType: (type: string) =>
        get().posts.filter((p) => p.type === type),
      getPostByStatus: (status: string) =>
        get().posts.filter((p) => p.status === status),
    }),
    {
      name: "post-storage",
      partialize: (state) => ({
        posts: state.posts,
      }),
      version: 1,
    },
  ),
);
