"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, List, Map, Search, Loader2, X } from "lucide-react"
import { usePosts, useCategories, useRegions, useCities, type PostFilters } from "@/hooks/usePosts"
import { PostCard } from "@/components/posts/PostCard"

export default function ExplorerPage() {
  const [filters, setFilters] = useState<PostFilters>({
    type: "ALL",
    categoryId: "all",
    regionId: "all",
    cityId: "all",
    search: "",
    page: 1,
    limit: 12,
  })
  const [searchInput, setSearchInput] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  // Hooks pour récupérer les données
  const { data: postsData, isLoading: postsLoading, error: postsError } = usePosts(filters)
  const { data: categoriesData } = useCategories()
  const { data: regionsData } = useRegions()
  const { data: citiesData } = useCities(filters.regionId !== "all" ? filters.regionId : undefined)

  // Gestion de la recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }))
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Gestion du changement de région (reset ville)
  const handleRegionChange = (regionId: string) => {
    setFilters((prev) => ({
      ...prev,
      regionId,
      cityId: "all", // Reset ville quand région change
      page: 1,
    }))
  }

  // Gestion des autres filtres
  const handleFilterChange = (key: keyof PostFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setFilters({
      type: "ALL",
      categoryId: "all",
      regionId: "all",
      cityId: "all",
      search: "",
      page: 1,
      limit: 12,
    })
    setSearchInput("")
  }

  // Compter les filtres actifs
  const activeFiltersCount = [
    filters.type !== "ALL",
    filters.categoryId !== "all",
    filters.regionId !== "all",
    filters.cityId !== "all",
    filters.search && filters.search.length > 0,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen w-full text-white">
      {/* Header Section */}
      <header className="py-10 text-center">
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">Explorer</h1>
        <p className="text-sm text-gray-300 md:text-base">Explorez les annonces et propositions</p>
      </header>

      {/* Search, Filters & View Section */}
      <section className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm py-4 px-4 shadow-md md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Ligne principale: Recherche et vues */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-full border border-gray-700 bg-gray-800 pl-4 pr-10 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex items-center gap-4">
              {/* Compteur de filtres actifs */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary text-white">
                    {activeFiltersCount} filtre
                    {activeFiltersCount > 1 ? "s" : ""}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-8 px-2 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* View Toggle (List/Map) */}
              <div className="flex items-center gap-1 rounded-full border border-gray-700 bg-gray-800 p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center justify-center rounded-full p-2 transition-colors ${
                    viewMode === "list" ? "bg-primary text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                  aria-label="Vue Liste"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center justify-center rounded-full p-2 transition-colors ${
                    viewMode === "map" ? "bg-primary text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                  aria-label="Vue Carte"
                >
                  <Map className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Ligne des filtres */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            {/* Type de post */}
            <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger className="w-40 border-gray-700 bg-gray-800 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800 text-white">
                <SelectItem value="ALL">Tous les types</SelectItem>
                <SelectItem value="GENERAL">Général</SelectItem>
                <SelectItem value="MISSION">Mission</SelectItem>
              </SelectContent>
            </Select>

            {/* Catégories */}
            <Select value={filters.categoryId} onValueChange={(value) => handleFilterChange("categoryId", value)}>
              <SelectTrigger className="w-48 border-gray-700 bg-gray-800 text-white">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800 text-white">
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categoriesData?.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category._count.posts})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Régions */}
            <Select value={filters.regionId} onValueChange={handleRegionChange}>
              <SelectTrigger className="w-40 border-gray-700 bg-gray-800 text-white">
                <SelectValue placeholder="Région" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800 text-white">
                <SelectItem value="all">Toutes les régions</SelectItem>
                {regionsData?.regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Villes */}
            <Select
              value={filters.cityId}
              onValueChange={(value) => handleFilterChange("cityId", value)}
              disabled={filters.regionId === "all"}
            >
              <SelectTrigger className="w-40 border-gray-700 bg-gray-800 text-white disabled:opacity-50">
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800 text-white">
                <SelectItem value="all">Toutes les villes</SelectItem>
                {citiesData?.cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name} ({city._count.posts})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <main className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Statistiques avec design amélioré */}
          {postsData && (
            <div className="mb-8 flex items-center justify-between rounded-lg bg-gray-900/50 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-sm font-medium text-gray-300">
                    {postsData.pagination.total} résultat
                    {postsData.pagination.total > 1 ? "s" : ""} trouvé
                    {postsData.pagination.total > 1 ? "s" : ""}
                  </p>
                </div>
                {activeFiltersCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {activeFiltersCount} filtre{activeFiltersCount > 1 ? "s" : ""} actif{activeFiltersCount > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-400">
                Page {postsData.pagination.page} sur {postsData.pagination.totalPages}
              </p>
            </div>
          )}

          {/* Loading state */}
          {postsLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-primary/20"></div>
              </div>
              <span className="mt-4 text-lg font-medium text-gray-300">Chargement des annonces...</span>
              <span className="mt-1 text-sm text-gray-500">Recherche en cours</span>
            </div>
          )}

          {/* Error state */}
          {postsError && (
            <div className="rounded-lg bg-red-900/20 border border-red-800 p-6 text-center">
              <p className="text-red-400">Erreur lors du chargement des annonces</p>
            </div>
          )}

          {/* Posts grid */}
          {postsData && postsData.posts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {postsData.posts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-in fade-in-50 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PostCard 
                    post={post} 
                    variant={index === 0 && postsData.posts.length > 1 ? "featured" : "default"}
                    showActions={true}
                    showStats={true}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {postsData && postsData.posts.length === 0 && !postsLoading && (
            <div className="rounded-lg bg-gray-900 p-12 text-center">
              <Filter className="mx-auto h-12 w-12 text-gray-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-300">Aucune annonce trouvée</h3>
              <p className="mt-2 text-sm text-gray-500">Essayez de modifier vos critères de recherche</p>
              {activeFiltersCount > 0 && (
                <Button variant="outline" onClick={resetFilters} className="mt-4 bg-transparent">
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          )}

          {/* Pagination améliorée */}
          {postsData && postsData.pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-lg bg-gray-900/50 p-2 backdrop-blur-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={postsData.pagination.page === 1}
                  onClick={() => handleFilterChange("page", (postsData.pagination.page - 1).toString())}
                  className="disabled:opacity-50 hover:bg-primary/20"
                >
                  Précédent
                </Button>
                
                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: Math.min(5, postsData.pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === postsData.pagination.page ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleFilterChange("page", pageNum.toString())}
                        className={`h-8 w-8 p-0 ${
                          pageNum === postsData.pagination.page 
                            ? "bg-primary text-white" 
                            : "hover:bg-primary/20"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  {postsData.pagination.totalPages > 5 && (
                    <>
                      <span className="px-2 text-gray-400">...</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFilterChange("page", postsData.pagination.totalPages.toString())}
                        className="h-8 w-8 p-0 hover:bg-primary/20"
                      >
                        {postsData.pagination.totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={postsData.pagination.page === postsData.pagination.totalPages}
                  onClick={() => handleFilterChange("page", (postsData.pagination.page + 1).toString())}
                  className="disabled:opacity-50 hover:bg-primary/20"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
