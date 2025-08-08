"use client";

import { useCategoryStore } from "@/app/api/store/category.store";
import { updateCategory, useCategories } from "@/hooks/category";
import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

const UpdateCategory = () => {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const updateCategoryMutation = updateCategory();
  const { categories, error } = useCategoryStore();

  // Fetch categories to ensure they're loaded
  useCategories();

  // Load existing category data
  useEffect(() => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      setCategoryName(category.name);
      setInitialLoading(false);
    } else {
      // If category not found in store, you might want to fetch it
      setInitialLoading(false);
    }
  }, [categoryId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Le nom de la catégorie ne peut pas être vide");
      return;
    }

    setLoading(true);
    try {
      await updateCategoryMutation.mutateAsync({
        name: categoryName.trim(),
        id: categoryId,
      });
      setLoading(false);
      toast.success(`Catégorie ${categoryName.trim()} mise à jour avec succès`);
      // Redirect back to categories list after successful update
      setTimeout(() => {
        router.push("/admin/category");
      }, 1500);
    } catch (error) {
      console.error("Error updating category", error);
      toast.error(`Erreur lors de la mise à jour de la catégorie`);
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="w-full mt-8">
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-2">
            Chargement de la catégorie...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-8">
      <Toaster />
      <div className="flex items-start gap-2">
        <div className="flex-1 flex-col space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/category")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <h2 className="text-2xl font-bold">Modifier la catégorie</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  Informations de la catégorie
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="py-2" htmlFor="categoryName">
                    Nom de la catégorie
                  </Label>
                  <Input
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    disabled={updateCategoryMutation.isPending || loading}
                    className="rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Entrez le nom de la catégorie"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
                    {error}
                  </div>
                )}

                {updateCategoryMutation.error && (
                  <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
                    {updateCategoryMutation.error.message}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/category")}
                  disabled={updateCategoryMutation.isPending || loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={
                    updateCategoryMutation.isPending ||
                    loading ||
                    !categoryName.trim()
                  }
                  className="disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updateCategoryMutation.isPending || loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Mise à jour...
                    </>
                  ) : (
                    "Mettre à jour"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
