"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { userRegister } from "@/hooks/user";
import {
  type registerFormValue,
  userRegisterSchema,
} from "@/validations/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  User,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import Image from "next/image";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const register = userRegister();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<registerFormValue>({
    resolver: zodResolver(userRegisterSchema),
  });

  const onSubmit = async (data: registerFormValue) => {
    try {
      setErrorMessage("");
      await register.mutateAsync({
        email: data.email,
        password: data.password,
      });
      toast.success("Compte créé avec succès");
    } catch (error: any) {
      toast.error("Échec de la création du compte");
      console.log("Erreur lors de la création du compte", error);
      setErrorMessage(
        error?.response?.data?.message || "Une erreur est survenue",
      );
    }
  };

  const socialProviders = [
    {
      name: "Google",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ),
    },
    {
      name: "GitHub",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 font-inter">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

        .font-inter {
          font-family: "Inter", sans-serif;
        }

        .animate-input:focus {
          transform: translateY(-2px);
        }

        .social-button {
          transition: all 0.3s ease;
        }

        .social-button:hover {
          transform: translateY(-2px);
        }

        .glass-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .glass-card:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }

        .submit-button {
          transition: all 0.3s ease;
          background-size: 200% auto;
          background-image: linear-gradient(
            to right,
            #3b82f6 0%,
            #2563eb 50%,
            #1d4ed8 100%
          );
        }

        .submit-button:hover {
          background-position: right center;
          transform: translateY(-2px);
        }
      `}</style>
      <Toaster position="top-center" theme="dark" />
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
          <Image
            src="/images/register.jpg"
            alt="Register"
            width={1920}
            height={1080}
            className="object-cover absolute inset-0 w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-black/80 backdrop-blur-[2px]"></div>
          <div className="relative z-10 text-center p-8 max-w-md">
            <div className="glass-card bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8 transform transition-all">
              <h2 className="text-4xl font-light tracking-tight text-white mb-3">
                <span className="font-semibold">Bienvenue</span> parmi nous
              </h2>
              <p className="text-lg text-gray-200/90 leading-relaxed">
                Créez votre compte pour accéder à toutes nos fonctionnalités et
                rejoindre notre communauté.
              </p>
            </div>
          </div>
        </div>
        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="lg:hidden mx-auto w-16 h-16 bg-gradient-to-br from-blue-600/30 to-blue-800/30 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-blue-500/20">
                <User className="h-8 w-8 text-blue-400" />
              </div>
              <h1 className="text-3xl font-light tracking-tight text-white mb-2">
                Créer un <span className="font-semibold">compte</span>
              </h1>
              <p className="text-gray-400 mt-2 text-sm">
                Rejoignez-nous en quelques étapes simples
              </p>
            </div>
            {/* Social Login Buttons */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-3 gap-3">
                {socialProviders.map((provider) => (
                  <Button
                    key={provider.name}
                    variant="outline"
                    className="social-button h-11 border-gray-700/60 bg-gray-800/40 text-gray-100 backdrop-blur-sm rounded-xl shadow-md hover:bg-gray-700/50 hover:border-gray-600"
                    onClick={() =>
                      toast.info(
                        `Connexion ${provider.name} bientôt disponible`,
                      )
                    }
                  >
                    <div className="flex items-center justify-center w-5 h-5">
                      {provider.icon}
                    </div>
                    <span className="sr-only">
                      Se connecter avec {provider.name}
                    </span>
                  </Button>
                ))}
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gray-700/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-950 px-2 text-gray-400">
                    Ou continuer avec
                  </span>
                </div>
              </div>
            </div>
            {/* Registration Form */}
            <Card className="glass-card shadow-2xl border border-gray-700/40 bg-gray-800/30 backdrop-blur-xl rounded-2xl">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-center text-white font-normal">
                  Informations du compte
                </CardTitle>
                <CardDescription className="text-center text-gray-400 text-sm">
                  Remplissez les champs ci-dessous pour créer votre compte
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  {/* Error Message */}
                  {errorMessage && (
                    <Alert
                      variant="destructive"
                      className="border-red-600/40 bg-red-900/20 text-red-300 rounded-xl animate-in fade-in duration-300"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-300"
                    >
                      Adresse email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...registerForm("email")}
                        type="email"
                        id="email"
                        placeholder="votre@email.com"
                        className="animate-input pl-10 h-11 border-gray-700/60 bg-gray-900/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-800/30 rounded-xl transition-all duration-300 hover:border-gray-600"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in duration-300">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-300"
                    >
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...registerForm("password")}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="••••••••"
                        className="animate-input pl-10 pr-10 h-11 border-gray-700/60 bg-gray-900/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-800/30 rounded-xl transition-all duration-300 hover:border-gray-600"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-800/70 text-gray-400 rounded-lg transition-colors duration-200"
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
                      <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in duration-300">
                        <AlertCircle className="h-3 w-3" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-300"
                    >
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...registerForm("confirmPassword")}
                        type={showPasswordConfirm ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="••••••••"
                        className="animate-input pl-10 pr-10 h-11 border-gray-700/60 bg-gray-900/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-800/30 rounded-xl transition-all duration-300 hover:border-gray-600"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setShowPasswordConfirm(!showPasswordConfirm)
                        }
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-800/70 text-gray-400 rounded-lg transition-colors duration-200"
                      >
                        {showPasswordConfirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPasswordConfirm
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"}
                        </span>
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in duration-300">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  {/* Terms and Conditions */}
                  <div className="text-xs text-gray-400 bg-gray-900/30 p-4 rounded-xl border border-gray-700/30 backdrop-blur-sm">
                    En créant un compte, vous acceptez nos{" "}
                    <Link
                      href="/terms"
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      conditions d'utilisation
                    </Link>{" "}
                    et notre{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      politique de confidentialité
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    disabled={register.isPending}
                    className="submit-button w-full h-11 text-white font-medium rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {register.isPending ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      "Créer mon compte"
                    )}
                  </Button>
                  {/* Login Link */}
                  <div className="text-center text-sm text-gray-400">
                    Vous avez déjà un compte ?{" "}
                    <Link
                      href="/auth/login"
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      Se connecter
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
