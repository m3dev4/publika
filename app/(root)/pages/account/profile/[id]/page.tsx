"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/app/api/store/auth.store";
import { updateProfile } from "@/hooks/user";
import {
  userUpdateProfileSchema,
  updateProfileFormValue,
} from "@/validations/user.validation";
import { useParams, useRouter } from "next/navigation";
import {
  Camera,
  User,
  MapPin,
  FileText,
  Eye,
  EyeOff,
  Save,
  X,
  Loader,
  CheckCircle,
  MessageCircleWarning,
  TriangleAlert,
  Shield,
  UserRound,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListRegions } from "@/hooks/region";
import { useListCities } from "@/hooks/city";
import { useCityStore } from "@/app/api/store/city.store";
import { Controller } from "react-hook-form";

const ProfileEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [showCustomCity, setShowCustomCity] = useState<boolean>(false);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);

  // Hooks pour charger les données
  const { data: regions, isLoading: regionsLoading } = useListRegions();
  const { data: cities, isLoading: citiesLoading } = useListCities();
  const { cities: storeCities } = useCityStore();

  const updateProfileMutation = updateProfile();
  // Utiliser directement les données du store

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    setValue,
    watch,
    reset,
    control,
  } = useForm<updateProfileFormValue>({
    resolver: zodResolver(userUpdateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      city: "",
      regionId: "",
      cityId: "",
      customCity: "",
      description: "",
      avatar: "",
      isTalent: false,
      isAnnouncer: false,
      password: "",
    },
  });

  const watchedValues = watch();

  // Effet pour filtrer les villes par région
  useEffect(() => {
    if (selectedRegionId && cities) {
      const filtered = cities.filter(
        (city) => city.regionId === selectedRegionId,
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [selectedRegionId, cities]);

  // Load user data when component mounts or user data changes
  useEffect(() => {
    if (user) {
      // Déterminer la région de l'utilisateur si il a une ville
      let userRegionId = "";
      if (user.city && cities) {
        const cityName =
          typeof user.city === "string" ? user.city : (user.city as any)?.name;
        const userCity = cities.find(
          (city) => city.name === cityName || city.id === user.cityId,
        );
        if (userCity) {
          userRegionId = userCity.regionId;
          setSelectedRegionId(userRegionId);
        }
      }

      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        city:
          typeof user.city === "string"
            ? user.city
            : (user.city as any)?.name || "",
        regionId: userRegionId,
        cityId: user.cityId || "",
        customCity: "",
        description: user.description || "",
        avatar: user.avatar || "",
        isTalent: user.isTalent || false,
        isAnnouncer: user.isAnnouncer || false,
        password: "",
      });
      setPreviewImage(user.avatar || null);
    }
  }, [user, reset, cities]);

  // Check if user can edit this profile
  useEffect(() => {
    if (user && params.id !== user.id) {
      toast.error("Vous ne pouvez modifier que votre propre profil");
      router.push("/home");
    }
  }, [user, params.id, router]);

  const saveSpecificFields = async (
    fieldsToSave: (keyof updateProfileFormValue)[],
  ) => {
    try {
      console.log("saveSpecificFields called with:", fieldsToSave);
      const data = watch();
      console.log("Current form data:", data);
      console.log("User data:", user);

      const modifiedData: Partial<updateProfileFormValue> = {};

      fieldsToSave.forEach((field) => {
        // Ajouter tous les champs demandés sans vérification de modification
        // car les nouveaux champs (regionId, cityId, customCity) n'existent pas sur User
        if (data[field] !== undefined && data[field] !== "") {
          (modifiedData as any)[field] = data[field];
          console.log(`Field ${field} added:`, data[field]);
        }
      });

      // Ajouter l'ID utilisateur pour l'update
      if (user?.id) {
        (modifiedData as any).id = user.id;
      }

      console.log("Modified data to send:", modifiedData);

      if (Object.keys(modifiedData).length <= 1) {
        // <= 1 car on a toujours l'ID
        toast.error("Aucune modification détectée");
        return;
      }

      console.log("Sending update request...");
      await updateProfileMutation.mutateAsync(modifiedData as any);
      console.log("Update successful");
      toast.success("Profil mis à jour avec succès!");
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    }
  };

  const onSubmit = async (data: updateProfileFormValue) => {
    try {
      console.log("Current form data:", data);
      console.log("User data:", user);
      console.log("Dirty fields:", dirtyFields);

      // Only send modified fields
      const modifiedData: Partial<updateProfileFormValue> = {};

      // Comparer manuellement avec les données utilisateur
      if (data.firstName !== user?.firstName)
        modifiedData.firstName = data.firstName;
      if (data.lastName !== user?.lastName)
        modifiedData.lastName = data.lastName;
      if (data.username !== user?.username)
        modifiedData.username = data.username;
      if (data.city !== user?.city) modifiedData.city = data.city;
      if (data.description !== user?.description)
        modifiedData.description = data.description;
      if (data.isTalent !== user?.isTalent)
        modifiedData.isTalent = data.isTalent;
      if (data.isAnnouncer !== user?.isAnnouncer)
        modifiedData.isAnnouncer = data.isAnnouncer;
      if (data.password && data.password.trim() !== "")
        modifiedData.password = data.password;
      if (data.avatar !== user?.avatar) modifiedData.avatar = data.avatar;

      console.log("Modified data:", modifiedData);

      if (Object.keys(modifiedData).length === 0) {
        toast.error("Aucune modification détectée");
        return;
      }

      await updateProfileMutation.mutateAsync(modifiedData);
      toast.success("Profil mis à jour avec succès!");

      // Reset form to new values
      reset(data);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    }
  };

  const handleUploadAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne peut pas dépasser 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.url) {
        setValue("avatar", data.url, { shouldDirty: true });
        setPreviewImage(data.url);
        await saveSpecificFields(["avatar"]);

        toast.success("Avatar uploadé avec succès");
      }
    } catch (error) {
      toast.error("Erreur lors de l'upload de l'avatar");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setPreviewImage(user?.avatar || null);
    toast.success("Modifications annulées");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Modifier votre profil
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Remplissez le formulaire ci-dessous pour modifier votre profil.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Mettez à jour votre nom, nom d&lsquo;utilisateur, ville et
                avatar.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-gray-200 dark:border-gray-700">
                  <AvatarImage
                    src={
                      watchedValues.avatar ||
                      "/placeholder.svg?height=100&width=100&query=user%20avatar"
                    }
                    alt="Avatar"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="grid gap-1.5 flex-1">
                  <Label htmlFor="avatar-upload">Changer l&lsquo;avatar</Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleUploadAvatar}
                    className="file:text-sm file:font-medium"
                  />
                  {isUploading && (
                    <Loader className="mr-2 h-4 w-4 animate-spin text-gray-500" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Prénom"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Nom"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d&rsquo;utilisateur</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nom d'utilisateur"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                {/* Sélection de région */}
                <div className="space-y-2">
                  <Label htmlFor="regionId">Région</Label>
                  <Controller
                    control={control}
                    name="regionId"
                    render={({ field }) => (
                      <Select
                        value={selectedRegionId}
                        onValueChange={(value) => {
                          setSelectedRegionId(value);
                          field.onChange(value);
                          setValue("cityId", ""); // Reset city selection
                          setValue("customCity", "");
                          setShowCustomCity(false);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              regionsLoading
                                ? "Chargement..."
                                : "Sélectionnez une région"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {regions?.map((region) => (
                            <SelectItem key={region.id} value={region.id}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.regionId && (
                    <p className="text-sm text-red-500">
                      {errors.regionId.message}
                    </p>
                  )}
                </div>
                {/* Sélection de ville */}
                {selectedRegionId && (
                  <div className="space-y-2">
                    <Label htmlFor="cityId">Ville</Label>
                    <Controller
                      control={control}
                      name="cityId"
                      render={({ field }) => (
                        <Select
                          value={showCustomCity ? "custom" : field.value || ""}
                          onValueChange={(value) => {
                            if (value === "custom") {
                              setShowCustomCity(true);
                              field.onChange("");
                              setValue("customCity", "");
                            } else {
                              setShowCustomCity(false);
                              const selectedCity = filteredCities.find(
                                (city) => city.id === value,
                              );
                              field.onChange(value);
                              setValue("customCity", "");
                              setValue("city", selectedCity?.name || "");
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                citiesLoading
                                  ? "Chargement..."
                                  : "Sélectionnez une ville"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredCities.map((city) => (
                              <SelectItem key={city.id} value={city.id}>
                                {city.name}
                              </SelectItem>
                            ))}
                            <SelectItem
                              value="custom"
                              className="text-blue-400 font-medium"
                            >
                              ➕ Autre (saisir manuellement)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.cityId && (
                      <p className="text-sm text-red-500">
                        {errors.cityId.message}
                      </p>
                    )}
                  </div>
                )}
                {/* Champ ville personnalisée */}
                {showCustomCity && (
                  <div className="space-y-2">
                    <Label htmlFor="customCity">Nom de votre ville</Label>
                    <Input
                      id="customCity"
                      placeholder="Entrez le nom de votre ville"
                      {...register("customCity")}
                      onChange={(e) => {
                        const value = e.target.value;
                        setValue("customCity", value);
                        setValue("city", value);
                      }}
                    />
                    {errors.customCity && (
                      <p className="text-sm text-red-500">
                        {errors.customCity.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button
                type="button"
                onClick={() =>
                  saveSpecificFields([
                    "firstName",
                    "lastName",
                    "username",
                    "regionId",
                    "cityId",
                    "customCity",
                    "city",
                    "avatar",
                  ])
                }
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sauvegarder"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Email Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TriangleAlert className="h-5 w-5 text-yellow-500" />
                Adresse e-mail
              </CardTitle>
              <CardDescription>
                Votre adresse e-mail ne peut pas être modifiée pour des raisons
                de sécurité.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  type="email"
                  value={user?.email}
                  disabled
                  className="cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                />
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Vérifié
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Security Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                Informations de sécurité
              </CardTitle>
              <CardDescription>
                Modifiez votre mot de passe pour sécuriser votre compte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Nouveau mot de passe"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 
                    h-8 w-8 text-gray-500 dark:text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"}
                    </span>
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Changer le mot de passe"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Role Change Card */}
          <Card>
            <CardHeader>
              <CardTitle>Changer le rôle de votre profil</CardTitle>
              <CardDescription>
                Vous pouvez changer le rôle actuel de votre profil.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isTalent">Talent</Label>
                <Switch
                  id="isTalent"
                  checked={watchedValues.isTalent}
                  onCheckedChange={(checked) =>
                    setValue("isTalent", checked as boolean)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isAnnouncer">Annonceur</Label>
                <Switch
                  id="isAnnouncer"
                  checked={watchedValues.isAnnouncer}
                  onCheckedChange={(checked) =>
                    setValue("isAnnouncer", checked as boolean)
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button
                type="button"
                onClick={() => saveSpecificFields(["isTalent", "isAnnouncer"])}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Changer le rôle"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Description Card */}
          <Card>
            <CardHeader>
              <CardTitle>Changer votre description</CardTitle>
              <CardDescription>
                Vous pouvez changer votre description pour vous identifier.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez-vous ici..."
                  {...register("description")}
                  className="min-h-[120px]" // Adjusted height
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button
                type="button"
                onClick={() => saveSpecificFields(["description"])}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Changer la description"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
