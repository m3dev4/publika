"use client"

import type React from "react"
import type { Post } from "@/hooks/usePosts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Clock,
  Euro,
  Heart,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Zap,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: Post
  variant?: "default" | "compact" | "featured"
  showActions?: boolean
  showStats?: boolean
}

export function EnhancedPostCard({ post, variant = "default", showActions = true, showStats = true }: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    if (username) {
      return username.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  const getDisplayName = () => {
    if (post.user.firstName && post.user.lastName) {
      return `${post.user.firstName} ${post.user.lastName}`
    }
    return post.user.username || "Utilisateur"
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href,
      })
    }
  }

  const handleShowMore = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMore(!showMore)
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (post.photo && post.photo.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % post.photo.length)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (post.photo && post.photo.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + post.photo.length) % post.photo.length)
    }
  }

  const isNew = () => {
    const postDate = new Date(post.createdAt)
    const now = new Date()
    const diffHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)
    return diffHours < 24
  }

  const isUrgent = () => post.type === "MISSION" && post.prices && post.prices > 500

  const truncatedContent = post.content.length > 150 ? post.content.substring(0, 150) + "..." : post.content

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-0 bg-teal-950 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 cursor-pointer",
        variant === "featured" &&
          "ring-2 ring-gradient-to-r ring-blue-500/50 bg-gradient-to-br from-blue-500/10 via-white/5 to-purple-500/10",
        variant === "compact" && "hover:-translate-y-1"
      )}
    >
      {/* Badges de statut */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {isNew() && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Zap className="w-3 h-3 mr-1" />
            Nouveau
          </Badge>
        )}
        {isUrgent() && (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Urgent
          </Badge>
        )}
        <Badge 
          className={cn(
            "border-0",
            post.type === "MISSION" 
              ? "bg-blue-500/20 text-blue-400" 
              : "bg-purple-500/20 text-purple-400"
          )}
        >
          {post.type === "MISSION" ? "Mission" : "Général"}
        </Badge>
      </div>

      {/* Actions de la carte */}
      {showActions && (
        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleLike}
            className={cn(
              "h-8 w-8 p-0 bg-black/20 backdrop-blur-sm hover:bg-black/40",
              isLiked && "text-red-500"
            )}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleBookmark}
            className={cn(
              "h-8 w-8 p-0 bg-black/20 backdrop-blur-sm hover:bg-black/40",
              isSaved && "text-yellow-500"
            )}
          >
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShare}
            className="h-8 w-8 p-0 bg-black/20 backdrop-blur-sm hover:bg-black/40"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Images */}
      {post.photo && post.photo.length > 0 && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.photo[currentImageIndex]}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Navigation des images */}
          {post.photo.length > 1 && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-black/20 backdrop-blur-sm hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-black/20 backdrop-blur-sm hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Indicateurs de pagination */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {post.photo.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      index === currentImageIndex 
                        ? "bg-white" 
                        : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <CardContent className="p-6">
        {/* En-tête avec avatar et info utilisateur */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 ring-2 ring-white/20">
            <AvatarImage src={post.user.avatar || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {getInitials(post.user.firstName, post.user.lastName, post.user.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{getDisplayName()}</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: fr })}</span>
            </div>
          </div>
        </div>

        {/* Titre */}
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
          {post.title}
        </h3>

        {/* Contenu */}
        <div className="text-gray-300 mb-4">
          <p className={cn("leading-relaxed", !showMore && "line-clamp-3")}>
            {showMore ? post.content : truncatedContent}
          </p>
          
          {post.content.length > 150 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowMore}
              className="mt-2 p-0 h-auto text-blue-400 hover:text-blue-300 hover:bg-transparent"
            >
              {showMore ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Voir moins
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Voir plus
                </>
              )}
            </Button>
          )}
        </div>

        {/* Informations supplémentaires */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
          {post.category && (
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs text-white p-2 rounded-full font-bold">
                {post.category.name}
              </Badge>
            </div>
          )}
          
          {post.city && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{post.city.name}</span>
            </div>
          )}
          
          {post.prices && (
            <div className="flex items-center gap-1 text-green-400">
              <Euro className="h-3 w-3" />
              <span className="font-semibold">{post.prices}€</span>
            </div>
          )}
        </div>

        {/* Actions supplémentaires */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "text-gray-400 hover:text-red-400 p-0 h-auto",
                  isLiked && "text-red-500"
                )}
              >
                <Heart className={cn("h-4 w-4 mr-1", isLiked && "fill-current")} />
                <span className="text-sm">J'aime</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-gray-400 hover:text-blue-400 p-0 h-auto"
              >
                <Share2 className="h-4 w-4 mr-1" />
                <span className="text-sm">Partager</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-green-400 p-0 h-auto"
              >
                <Phone className="h-4 w-4 mr-1" />
                <span className="text-sm">Contacter</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
