import { useQuery } from "@tanstack/react-query";
import { PostType } from "@/lib/prisma-client-js";

export interface PostFilters {
  type?: PostType | "ALL";
  categoryId?: string;
  regionId?: string;
  cityId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  type: PostType;
  photo: string[];
  prices?: number;
  createdAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    avatar?: string;
    isTalent: boolean;
    isAnnouncer: boolean;
  };
  category?: {
    id: string;
    name: string;
  };
  city?: {
    id: string;
    name: string;
    region: {
      id: string;
      name: string;
    };
  };
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const fetchPosts = async (filters: PostFilters): Promise<PostsResponse> => {
  const params = new URLSearchParams();

  if (filters.type && filters.type !== "ALL")
    params.append("type", filters.type);
  if (filters.categoryId && filters.categoryId !== "all")
    params.append("categoryId", filters.categoryId);
  if (filters.regionId && filters.regionId !== "all")
    params.append("regionId", filters.regionId);
  if (filters.cityId && filters.cityId !== "all")
    params.append("cityId", filters.cityId);
  if (filters.search) params.append("search", filters.search);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());

  const response = await fetch(`/api/posts?${params.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des posts");
  }

  return response.json();
};

export const usePosts = (filters: PostFilters = {}) => {
  return useQuery({
    queryKey: ["posts", filters],
    queryFn: () => fetchPosts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour les catégories
export interface Category {
  id: string;
  name: string;
  _count: {
    posts: number;
  };
}

const fetchCategories = async (): Promise<{ categories: Category[] }> => {
  const response = await fetch("/api/categories", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des catégories");
  }

  return response.json();
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour les régions
export interface Region {
  id: string;
  name: string;
  cities: City[];
}

export interface City {
  id: string;
  name: string;
  _count: {
    posts: number;
  };
}

const fetchRegions = async (): Promise<{ regions: Region[] }> => {
  const response = await fetch("/api/regions", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des régions");
  }

  return response.json();
};

export const useRegions = () => {
  return useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour les villes par région
const fetchCities = async (regionId?: string): Promise<{ cities: City[] }> => {
  const params = new URLSearchParams();
  if (regionId && regionId !== "all") params.append("regionId", regionId);

  const response = await fetch(`/api/cities?${params.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des villes");
  }

  return response.json();
};

export const useCities = (regionId?: string) => {
  return useQuery({
    queryKey: ["cities", regionId],
    queryFn: () => fetchCities(regionId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!regionId,
  });
};
