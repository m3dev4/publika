"use client";

import { useCategoryStore } from "@/app/api/store/category.store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseCreatePost } from "@/hooks/post";
import { useCategories } from "@/hooks/category";
import { useListRegions } from "@/hooks/region";
import { useListCities } from "@/hooks/city";
import { useRegionStore } from "@/app/api/store/region.store";
import { useCityStore } from "@/app/api/store/city.store";
import {
  postValidation,
  PostValidationValue,
} from "@/validations/post.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast, Toaster } from "sonner";

const PostPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [showPreview, setShowPreview] = useState(false);
  const createPost = UseCreatePost();
  const { categories } = useCategoryStore();
  const { region: regions } = useRegionStore();
  const { cities } = useCityStore();
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");

  // Charger les catégories depuis l'API
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Charger régions et villes
  const { data: regionsData } = useListRegions();
  const { data: citiesData } = useListCities();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<PostValidationValue>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      title: "",
      content: "",
      type: "GENERAL",
      categoryId: "",
      cityId: "",
      photos: [],
      price: undefined,
    },
  });

  const formValues = watch();

  const handlePreview = (data: PostValidationValue) => {
    setShowPreview(true);
  };

  const handlePublish = async (data: PostValidationValue) => {
    try {
      await createPost.mutateAsync({ ...data, status: "PUBLISHED" });
      setStatus("PUBLISHED");
      toast.success("Post publié avec succès");
      setShowPreview(false);
    } catch (error) {
      toast.error("Échec de la publication du post");
    }
  };

  const handleReset = () => {
    reset();
    setShowPreview(false);
    setStatus("DRAFT");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-950 py-10 text-gray-100">
      <Toaster position="top-center" theme="dark" />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 px-2 md:px-0">
        {/* Formulaire de création */}
        <div className="w-full md:w-1/2">
          <Card className="shadow-2xl border border-gray-700/60 bg-gray-800/40 backdrop-blur-xl rounded-3xl transition-all duration-300">
            <CardContent className="pt-10 pb-4 px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white">
                    Créer un post
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Complète les champs puis prévisualise avant de publier.
                  </p>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-xs font-semibold shadow ${status === "DRAFT" ? "bg-yellow-600/20 text-yellow-300 border border-yellow-600" : "bg-green-600/20 text-green-300 border border-green-600"}`}
                >
                  {status === "DRAFT" ? "Brouillon" : "Publié"}
                </span>
              </div>
              <form
                className="space-y-6"
                onSubmit={handleSubmit(handlePreview)}
              >
                <div>
                  <Label className="text-xs text-gray-300">Titre</Label>
                  <Input
                    {...register("title")}
                    placeholder="Titre du post"
                    className="mt-2 rounded-xl border border-gray-700 bg-gray-900/60 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-800 transition-all"
                  />
                  <p className="text-red-400 text-xs mt-1 font-medium">
                    {errors.title?.message}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Contenu</Label>
                  <Textarea
                    {...register("content")}
                    placeholder="Décris ton post..."
                    className="mt-2 h-32 rounded-xl border border-gray-700 bg-gray-900/60 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-800 transition-all"
                    rows={6}
                  />
                  <p className="text-red-400 text-xs mt-1 font-medium">
                    {errors.content?.message}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <Label className="text-xs text-gray-300">Type</Label>
                    <Controller
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          defaultValue=""
                        >
                          <SelectTrigger className="rounded-xl border border-gray-700 bg-gray-900/60 text-white">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 text-white border border-gray-700">
                            <SelectGroup>
                              <SelectLabel className="text-gray-400">
                                Type
                              </SelectLabel>
                              <SelectItem value="GENERAL">General</SelectItem>
                              <SelectItem value="MISSION">Mission</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue=""
                      >
                        <SelectTrigger className="rounded-xl border border-gray-700 bg-gray-900/60 text-white">
                          <SelectValue placeholder="Categorie" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 text-white border border-gray-700">
                          <SelectGroup>
                            <SelectLabel className="text-gray-400">
                              Categorie
                            </SelectLabel>
                            {categoriesLoading ? (
                              <p className="text-xs text-center text-gray-400">
                                Chargement...
                              </p>
                            ) : categories.length === 0 ? (
                              <p className="text-xs text-center text-gray-400">
                                Aucune catégorie
                              </p>
                            ) : (
                              categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {/* Region et Ville */}
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <Label className="text-xs text-gray-300">Région</Label>
                    <Select
                      value={selectedRegionId}
                      onValueChange={(val) => {
                        setSelectedRegionId(val);
                        // Reset cityId when region changes
                        setValue("cityId", "");
                      }}
                    >
                      <SelectTrigger className="rounded-xl border border-gray-700 bg-gray-900/60 text-white">
                        <SelectValue placeholder="Sélectionne une région" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border border-gray-700">
                        <SelectGroup>
                          <SelectLabel className="text-gray-400">
                            Régions
                          </SelectLabel>
                          {(regions || []).length === 0 ? (
                            <p className="text-xs text-center text-gray-400">
                              Aucune région
                            </p>
                          ) : (
                            regions.map((r) => (
                              <SelectItem key={r.id} value={r.id}>
                                {r.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-1/2">
                    <Label className="text-xs text-gray-300">Ville</Label>
                    <Controller
                      control={control}
                      name="cityId"
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          disabled={!selectedRegionId}
                        >
                          <SelectTrigger className="rounded-xl border border-gray-700 bg-gray-900/60 text-white">
                            <SelectValue placeholder={selectedRegionId ? "Sélectionne une ville" : "Choisis d'abord une région"} />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 text-white border border-gray-700">
                            <SelectGroup>
                              <SelectLabel className="text-gray-400">
                                Villes
                              </SelectLabel>
                              {(cities || [])
                                .filter((c) => c.regionId === selectedRegionId)
                                .map((city) => (
                                  <SelectItem key={city.id} value={city.id}>
                                    {city.name}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Photos</Label>
                  <Input
                    {...register("photos")}
                    type="file"
                    multiple
                    className="mt-2 rounded-xl border border-gray-700 bg-gray-900/60 text-white file:text-white file:bg-blue-600 file:border-0 file:rounded-md file:py-1 file:px-3 file:mr-2 hover:file:bg-blue-700 transition-colors"
                  />
                  <p className="text-red-500 text-sm mt-2">
                    {errors.photos?.message}
                  </p>
                </div>
                {/* <div>
                  <Label>Prix</Label>
                  <Input {...register("price")} type="number" />
                  <p className="text-red-500 text-sm mt-2">{errors.price?.message}</p>
                </div> */}
                <div className="flex gap-2 pt-6">
                  <Button
                    type="button"
                    className="w-1/3 rounded-xl bg-gray-700 text-white hover:bg-gray-600 hover:scale-[1.03] transition-all shadow"
                    variant="secondary"
                    onClick={handleSubmit(handlePreview)}
                  >
                    Preview
                  </Button>
                  <Button
                    type="button"
                    className="w-1/3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.03] transition-all shadow"
                    variant="default"
                    disabled={status === "PUBLISHED" || createPost.isPending}
                    onClick={handleSubmit(handlePublish)}
                  >
                    {createPost.isPending ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Publier"
                    )}
                  </Button>
                  <Button
                    type="button"
                    className="w-1/3 rounded-xl bg-gray-900 text-blue-400 border border-gray-700 hover:bg-gray-800 hover:scale-[1.03] transition-all shadow"
                    variant="outline"
                    onClick={handleReset}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Preview */}
        <div className="w-full md:w-1/2 mt-10 md:mt-0">
          <Card className="shadow-2xl border border-gray-700/60 bg-gray-800/40 backdrop-blur-xl rounded-3xl transition-all duration-300">
            <CardContent className="pt-10 pb-6 px-8">
              <h2 className="text-2xl font-black tracking-tight text-white mb-4 flex items-center gap-2">
                Aperçu du post
                {status === "DRAFT" && (
                  <span className="bg-yellow-600/20 text-yellow-300 border border-yellow-600 rounded px-2 py-0.5 text-xs ml-2">
                    Brouillon
                  </span>
                )}
                {status === "PUBLISHED" && (
                  <span className="bg-green-600/20 text-green-300 border border-green-600 rounded px-2 py-0.5 text-xs ml-2">
                    Publié
                  </span>
                )}
              </h2>
              {showPreview ? (
                <article className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {formValues.title || (
                        <span className="text-gray-500">(Aucun titre)</span>
                      )}
                    </h3>
                  </div>
                  <div className="prose prose-invert max-w-none text-gray-300 bg-gray-800/30 rounded-xl p-4 border border-gray-700/60 backdrop-blur-sm">
                    {formValues.content || (
                      <span className="text-gray-500">(Aucun contenu)</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-semibold text-gray-400">
                        Type :
                      </span>
                      <span className="ml-1 text-blue-300 font-bold">
                        {formValues.type === "MISSION" ? "Mission" : "Général"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-semibold text-gray-400">
                        Catégorie :
                      </span>
                      <span className="ml-1 text-blue-300 font-bold">
                        {categories.find((c) => c.id === formValues.categoryId)
                          ?.name || (
                          <span className="text-gray-500">(Aucune)</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-semibold text-gray-400">
                        Région :
                      </span>
                      <span className="ml-1 text-blue-300 font-bold">
                        {regions.find?.((r) => r.id === selectedRegionId)?.name || (
                          <span className="text-gray-500">(Aucune)</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-semibold text-gray-400">Ville :</span>
                      <span className="ml-1 text-blue-300 font-bold">
                        {cities.find?.((c) => c.id === formValues.cityId)?.name || (
                          <span className="text-gray-500">(Aucune)</span>
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Affichage des photos sélectionnées (juste le nom) */}
                  {formValues.photos && formValues.photos.length > 0 && (
                    <div className="mt-2">
                      <span className="font-semibold text-gray-400">
                        Photos :
                      </span>
                      <ul className="list-disc ml-6 mt-1">
                        {Array.from(formValues.photos as any).map(
                          (file: any, idx: number) => (
                            <li key={idx} className="text-gray-300 text-sm">
                              {file.name || file}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                  {/* <div>
                    <span className="font-semibold text-gray-600">Prix :</span>
                    <span className="ml-2 text-gray-800">{formValues.price || <span className="text-gray-400">(Aucun)</span>}</span>
                  </div> */}
                </article>
              ) : (
                <div className="text-gray-500 text-center py-12 font-medium">
                  Remplis le formulaire et clique sur "Preview" pour voir
                  l’aperçu de ton post.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
