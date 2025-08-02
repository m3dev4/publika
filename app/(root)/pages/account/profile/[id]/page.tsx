"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/app/api/store/auth.store";
import { updateProfile } from "@/hooks/user";
import { userUpdateProfileSchema, updateProfileFormValue } from "@/validations/user.validation";
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

const ProfileEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const updateProfileMutation = updateProfile();
  // Utiliser directement les données du store

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    setValue,
    watch,
    reset,
  } = useForm<updateProfileFormValue>({
    resolver: zodResolver(userUpdateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      city: "",
      description: "",
      avatar: "",
      isTalent: false,
      isAnnouncer: false,
      password: "",
    },
  });

  const watchedValues = watch();

  // Load user data when component mounts or user data changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        city: user.city || "",
        description: user.description || "",
        avatar: user.avatar || "",
        isTalent: user.isTalent || false,
        isAnnouncer: user.isAnnouncer || false,
        password: "",
      });
      setPreviewImage(user.avatar || null);
    }
  }, [user, reset]);

  // Check if user can edit this profile
  useEffect(() => {
    if (user && params.id !== user.id) {
      toast.error("Vous ne pouvez modifier que votre propre profil");
      router.push("/home");
    }
  }, [user, params.id, router]);

  const saveSpecificFields = async (fieldsToSave: (keyof updateProfileFormValue)[]) => {
    try {
      console.log("saveSpecificFields called with:", fieldsToSave);
      const data = watch();
      console.log("Current form data:", data);
      console.log("User data:", user);

      const modifiedData: Partial<updateProfileFormValue> = {};

      fieldsToSave.forEach((field) => {
        console.log(`Checking field ${field}: form=${data[field]}, user=${user?.[field]}`);
        if (data[field] !== user?.[field]) {
          modifiedData[field] = data[field];
          console.log(`Field ${field} modified:`, data[field]);
        }
      });

      console.log("Modified data to send:", modifiedData);

      if (Object.keys(modifiedData).length === 0) {
        toast.error("Aucune modification détectée");
        return;
      }

      console.log("Sending update request...");
      await updateProfileMutation.mutateAsync(modifiedData);
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
      if (data.firstName !== user?.firstName) modifiedData.firstName = data.firstName;
      if (data.lastName !== user?.lastName) modifiedData.lastName = data.lastName;
      if (data.username !== user?.username) modifiedData.username = data.username;
      if (data.city !== user?.city) modifiedData.city = data.city;
      if (data.description !== user?.description) modifiedData.description = data.description;
      if (data.isTalent !== user?.isTalent) modifiedData.isTalent = data.isTalent;
      if (data.isAnnouncer !== user?.isAnnouncer) modifiedData.isAnnouncer = data.isAnnouncer;
      if (data.password && data.password.trim() !== "") modifiedData.password = data.password;
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

  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
                Mettez à jour votre nom, nom d&lsquo;utilisateur, ville et avatar.
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
                  {isUploading && <Loader className="mr-2 h-4 w-4 animate-spin text-gray-500" />}
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
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" type="text" placeholder="Nom" {...register("lastName")} />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
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
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" type="text" placeholder="Ville" {...register("city")} />
                  {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button
                type="button"
                onClick={() =>
                  saveSpecificFields(["firstName", "lastName", "username", "city", "avatar"])
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
                Votre adresse e-mail ne peut pas être modifiée pour des raisons de sécurité.
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
                <span className="text-sm text-gray-600 dark:text-gray-400">Vérifié</span>
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
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    </span>
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
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
              <CardDescription>Vous pouvez changer le rôle actuel de votre profil.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isTalent">Talent</Label>
                <Switch
                  id="isTalent"
                  checked={watchedValues.isTalent}
                  onCheckedChange={(checked) => setValue("isTalent", checked as boolean)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isAnnouncer">Annonceur</Label>
                <Switch
                  id="isAnnouncer"
                  checked={watchedValues.isAnnouncer}
                  onCheckedChange={(checked) => setValue("isAnnouncer", checked as boolean)}
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
                  <p className="text-sm text-red-500">{errors.description.message}</p>
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
