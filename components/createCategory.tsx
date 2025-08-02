"use client";
import { createCategory, useCategories } from "@/hooks/category";
import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ZodError, z } from "zod";

const categorySchema = z.object({
  name: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(50, "Le nom doit contenir au maximum 50 caractères"),
});

type CategorySchema = z.infer<typeof categorySchema>;

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const createCategoryMutation = createCategory();
  const { error } = useCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = categorySchema.safeParse({ name: categoryName.trim() });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({ name: categoryName.trim() });
      setCategoryName("");
      setLoading(false);
      toast.success(`Catégorie ${categoryName.trim()} créée avec succès`);
    } catch (error) {
      console.error("Error creating category", error);
      toast.error(`Error creating category ${categoryName.trim()}`);
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-8">
      <Toaster />
      <div className="flex items-start gap-2">
        <div className="flex-1 flex-col space-y-2">
          <h2 className="text-2xl font-bold">Créer une catégorie</h2>
          <form onSubmit={handleSubmit} className="space-y-2">
            <Card>
              <CardContent className="">
                <Label className="py-2" htmlFor="categoryName">
                  Nom du catégorie
                </Label>
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  disabled={createCategoryMutation.isPending}
                  className="rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={createCategoryMutation.isPending}
                  className="w-full disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  {createCategoryMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Créer"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
          <div>
            {error && (
              <Alert>
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            {createCategoryMutation.error && (
              <Alert>
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{createCategoryMutation.error.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
