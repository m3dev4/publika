"use client";

import type React from "react";

import type { Post } from "@/hooks/usePosts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Euro,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Zap,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  variant?: "default" | "compact" | "featured";
  showActions?: boolean;
  showStats?: boolean;
}

export function EnhancedPostCard({
  post,
  variant = "default",
  showActions = true,
  showStats = true,
}: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const getInitials = (
    firstName?: string,
    lastName?: string,
    username?: string,
  ) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (post.user.firstName && post.user.lastName) {
      return `${post.user.firstName} ${post.user.lastName}`;
    }
    return post.user.username || "Utilisateur";
  };

  //   const handleLike = (e: React.MouseEvent) => {
  //     e.stopPropagation()
  //     setIsLiked(!isLiked)
  //     setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  //   }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href,
      });
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.photo && post.photo.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % post.photo.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.photo && post.photo.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + post.photo.length) % post.photo.length,
      );
    }
  };

  const isNew = () => {
    const postDate = new Date(post.createdAt);
    const now = new Date();
    const diffHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  //   const isPopular = () => viewCount > 50
  const isUrgent = () =>
    post.type === "MISSION" && post.prices && post.prices > 500;

  return (
    <Card
      className={cn(
        "group h-full overflow-hidden border-gray-700/50 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1",
        variant === "featured" &&
          "border-primary/70 bg-gradient-to-br from-primary/10 via-gray-800 to-gray-900 ring-1 ring-primary/20",
        variant === "compact" && "h-auto",
      )}
    >
      {/* Image principale avec carrousel */}
      {post.photo && post.photo.length > 0 && (
        <div
          className={cn(
            "relative w-full overflow-hidden",
            variant === "compact" ? "h-32" : "h-48",
          )}
        >
          <Image
            src={post.photo[currentImageIndex] || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Indicateurs de statut avec design amélioré */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Badge
              variant={post.type === "MISSION" ? "default" : "secondary"}
              className={cn(
                "backdrop-blur-sm border-0 font-medium shadow-lg",
                post.type === "MISSION" 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white" 
                  : "bg-gradient-to-r from-gray-600 to-gray-700 text-white"
              )}
            >
              {post.type === "MISSION" ? "🎯 Mission" : "📝 Général"}
            </Badge>

            {isNew() && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse backdrop-blur-sm border-0 shadow-lg">
                <Zap className="mr-1 h-3 w-3" />
                Nouveau
              </Badge>
            )}

            {isUrgent() && (
              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse backdrop-blur-sm border-0 shadow-lg">
                ⚡ Urgent
              </Badge>
            )}
          </div>

          {/* Prix avec design premium */}
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            {post.prices && (
              <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold backdrop-blur-sm border-0 shadow-lg px-3 py-1">
                <Euro className="mr-1 h-3 w-3" />
                {post.prices.toLocaleString("fr-FR")} FCFA
              </Badge>
            )}
          </div>

          {/* Navigation carrousel */}
          {post.photo.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Indicateurs de pagination */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {post.photo.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      index === currentImageIndex ? "bg-white" : "bg-white/50",
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Actions rapides sur hover */}
          {showActions && (
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Heart
                className={cn(
                  "h-4 w-4",
                  isLiked && "fill-red-500 text-red-500",
                )}
              />

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                onClick={handleSave}
              >
                <Bookmark
                  className={cn(
                    "h-4 w-4",
                    isSaved && "fill-yellow-500 text-yellow-500",
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      <CardHeader className={cn("pb-3 px-4", variant === "compact" && "pb-2")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3
              className={cn(
                "line-clamp-2 font-bold text-white group-hover:text-primary transition-colors duration-300",
                variant === "compact" ? "text-base" : "text-lg",
              )}
            >
              {post.title}
            </h3>
            {variant !== "compact" && (
              <p className="mt-2 line-clamp-2 text-sm text-gray-300 leading-relaxed">
                {post.content}
              </p>
            )}
          </div>
        </div>

        {/* Informations de localisation et catégorie avec design amélioré */}
        <div className="mt-3 flex flex-wrap gap-2">
          {post.city && (
            <div className="flex items-center gap-1 rounded-full bg-gray-700/50 px-2 py-1 backdrop-blur-sm">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-gray-200">
                {post.city.name}, {post.city.region.name}
              </span>
            </div>
          )}
          {post.category && (
            <Badge 
              variant="outline" 
              className="text-xs border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              {post.category.name}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-4 pb-4">
        {/* Section utilisateur avec design premium */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar
                className={cn(
                  "ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40",
                  variant === "featured" ? "h-10 w-10" : "h-8 w-8"
                )}
              >
                <AvatarImage
                  src={post.user.avatar || "/placeholder.svg"}
                  alt={getDisplayName()}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-xs font-bold text-white">
                  {getInitials(
                    post.user.firstName,
                    post.user.lastName,
                    post.user.username,
                  )}
                </AvatarFallback>
              </Avatar>
              {/* Indicateur en ligne */}
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></div>
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-semibold text-white group-hover:text-primary transition-colors",
                  variant === "compact" ? "text-xs" : "text-sm",
                )}
              >
                {getDisplayName()}
              </span>
              <div className="flex gap-1 mt-1">
                {post.user.isTalent && (
                  <Badge variant="outline" className="text-xs border-blue-400/30 bg-blue-400/10 text-blue-300 px-2 py-0.5">
                    ⭐ Talent
                  </Badge>
                )}
                {post.user.isAnnouncer && (
                  <Badge variant="outline" className="text-xs border-purple-400/30 bg-purple-400/10 text-purple-300 px-2 py-0.5">
                    📢 Annonceur
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Date et actions avec design amélioré */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 rounded-full bg-gray-700/30 px-2 py-1 backdrop-blur-sm">
              <Clock className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-gray-300">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </span>
            </div>

            {/* Actions de contact rapide avec design moderne */}
            {showActions && variant !== "compact" && (
              <div className="flex gap-1 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <Phone className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <Mail className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
