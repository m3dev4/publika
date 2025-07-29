"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/api/store/auth.store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

const VerifySuccess = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Attendre un peu pour s'assurer que le store est mis à jour
    const timer = setTimeout(() => {
      if (isAuthenticated && user?.isVerify) {
        if (user.onboarding) {
          router.replace("/home");
        } else {
          router.replace("/onboarding");
        }
      } else {
        // Si pas authentifié, rediriger vers login
        router.replace("/auth/login");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Email vérifié !
          </CardTitle>
          <CardDescription className="text-gray-600">
            Votre email a été vérifié avec succès. Redirection en cours...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-gray-500">Redirection en cours...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifySuccess;
