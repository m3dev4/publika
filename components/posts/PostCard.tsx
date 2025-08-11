import type { Post } from "@/hooks/usePosts"
import { EnhancedPostCard } from "./EnhancedPostCard"

interface PostCardProps {
  post: Post
  variant?: "default" | "compact" | "featured"
  showActions?: boolean
  showStats?: boolean
}

export function PostCard({ post, ...props }: PostCardProps) {
  return <EnhancedPostCard post={post} {...props} />
}
