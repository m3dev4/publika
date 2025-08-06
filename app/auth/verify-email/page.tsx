"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { userVerifyEmail } from "@/hooks/user";

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const verifyEmailMutation = userVerifyEmail();

  useEffect(() => {
    // Focus on first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newCode = [...verificationCode];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/\d/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }

    setVerificationCode(newCode);

    // Focus on next empty input or last input
    const nextEmptyIndex = newCode.findIndex((code) => !code);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");
    
    if (code.length !== 6) {
      toast.error("Veuillez entrer le code de vérification complet");
      return;
    }

    try {
      await verifyEmailMutation.mutateAsync(code);
      toast.success("Email vérifié avec succès!");
      // La navigation est déjà gérée dans le hook
    } catch (error: any) {
      toast.error(error.message || "Code de vérification invalide ou expiré");
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Adresse email manquante");
      return;
    }

    setIsResending(true);

    try {
      // TODO: Call resend verification email API
      // await resendVerificationEmail({ email });

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Code de vérification renvoyé!");
      setVerificationCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error("Erreur lors du renvoi du code");
    } finally {
      setIsResending(false);
    }
  };

  const isCodeComplete = verificationCode.every((digit) => digit !== "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Vérifiez votre email
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Nous avons envoyé un code de vérification à{" "}
                <span className="font-medium text-gray-900">{email || "votre adresse email"}</span>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Code de vérification</Label>

              <div className="flex gap-3 justify-center">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                    disabled={verifyEmailMutation.isPending || isResending}
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={handleVerify}
              disabled={!isCodeComplete || verifyEmailMutation.isPending}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {verifyEmailMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Vérification...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Vérifier le code
                </div>
              )}
            </Button>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">Vous n'avez pas reçu le code ?</p>

              <Button
                variant="ghost"
                onClick={handleResendCode}
                disabled={isResending}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
              >
                {isResending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                    Renvoi en cours...
                  </div>
                ) : (
                  "Renvoyer le code"
                )}
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={() => router.push("/auth/login")}
                className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la connexion
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Le code expire dans 24 heures. Vérifiez aussi vos spams.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
