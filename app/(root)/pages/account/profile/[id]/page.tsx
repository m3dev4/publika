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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne peut pas dépasser 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Here you would typically upload to a service like Cloudinary, AWS S3, etc.
      // For now, we'll use a placeholder URL
      const imageUrl = URL.createObjectURL(file);
      setValue("avatar", imageUrl, { shouldDirty: true });

      toast.success("Image uploadée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'upload de l'image");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: updateProfileFormValue) => {
    try {
      // Only send modified fields
      const modifiedData: Partial<updateProfileFormValue> = {};

      Object.keys(dirtyFields).forEach((key) => {
        const fieldKey = key as keyof updateProfileFormValue;
        if (dirtyFields[fieldKey]) {
          modifiedData[fieldKey] = data[fieldKey];
        }
      });

      // Don't send empty password
      if (modifiedData.password === "") {
        delete modifiedData.password;
      }

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

  const handleCancel = () => {
    reset();
    setPreviewImage(user?.avatar || null);
    toast.success("Modifications annulées");
  };

  return (
    <div className="min-h-screen w-full relative">
      <Toaster />
      {/* Header */}
      <div className="flex items-center justify-between p-4 py-8 w-full">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Modifier votre profil</h2>
            <p className="text-sm text-gray-500">
              Remplissez le formulaire ci-dessous pour modifier votre profil
            </p>
          </div>
        </div>
      </div>

      {/* Form 1*/}
      <div className="w-full p-4 flex">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full absolute left-0">
          <Card>
            <CardHeader>
              <CardTitle>Information personnelle</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex space-x-2 flex-wrap items-center">
                <div className="space-y-2 py-2">
                  <Label>Prénom</Label>
                  <Input type="text" placeholder="Prénom" {...register("firstName")} />
                  {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2 py-2">
                  <Label>Nom</Label>
                  <Input type="text" placeholder="Nom" {...register("lastName")} />
                  {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                </div>

                <div className="space-y-2 py-2">
                  <Label>username</Label>
                  <Input type="text" placeholder="username" {...register("username")} />
                  {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                </div>
                <div className="space-y-2 py-2">
                  <Label>City</Label>
                  <Input type="text" placeholder="City" {...register("city")} />
                  {errors.city && <p className="text-red-500">{errors.city.message}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                onClick={async () => {
                  const formData = watch();
                  await onSubmit(formData);
                }}
                className=""
              >
                {updateProfileMutation.isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sauvegarder"
                )}
              </Button>
              <Button type="button" onClick={handleCancel} className="">
                Annuler
              </Button>
            </CardFooter>
          </Card>

          {/* Message to indicate the email is not modifiable */}
          <div className="w-ful p-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                <TriangleAlert className="w-5 h-5 text-yellow-500" />{" "}
                <p className="text-sm mt-4">
                  Votre email ne peut pas être modifié pour des raisons de sécurité.
                </p>
              </div>
              <div className="flex items-center space-x-2 w-full">
                <Input
                  id="email"
                  type="email"
                  value={user?.email}
                  disabled
                  className="cursor-not-allowed transition-colors"
                  placeholder={user?.email || ""}
                />
                <CheckCircle className="w-5 h-5 text-green-500" />{" "}
                <span className="text-xs">Vérifié</span>
              </div>
            </div>
          </div>

          {/* Form 2 */}

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                <div>
                  <CardTitle>Informations de sécurité</CardTitle>
                  <CardDescription>
                    Modifier votre mot de passe pour sécuriser votre compte
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    type="password"
                    id="password"
                    placeholder="Nouveau mot de passe"
                    {...register("password")}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                  {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit">
                {updateProfileMutation.isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Changer le mot de passe"
                )}
              </Button>
              <Button type="button" onClick={handleCancel}>
                Annuler
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
