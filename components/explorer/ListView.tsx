"use client";

import { PostCard } from "@/components/posts/PostCard";

interface Post {
  id: string;
  title: string;
  description: string;
  type: string;
  budget?: number;
  city: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  };
  category: {
    name: string;
  };
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  _count: {
    views: number;
    likes: number;
    proposals: number;
  };
}

interface ListViewProps {
  posts: Post[];
}

export function ListView({ posts }: ListViewProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className="animate-in fade-in-50 slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <PostCard
            post={post}
            variant={
              index === 0 && posts.length > 1 ? "featured" : "default"
            }
            showActions={true}
            showStats={true}
          />
        </div>
      ))}
    </div>
  );
}